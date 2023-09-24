import {Context} from 'koa';
import {addressArray} from '../index';
import * as fs from 'fs';


function getDistanceFromCoordinates(x1: number, y1: number, x2: number, y2: number) {
  x1 = x1 * Math.PI / 180;
  y1 = y1 * Math.PI / 180;
  x2 = x2 * Math.PI / 180;
  y2 = y2 * Math.PI / 180;

  // Haversine formula
  let dx = x2 - x1;
  let dy = y2 - y1;
  let a = Math.pow(Math.sin(dy / 2), 2)
    + Math.cos(y1) * Math.cos(y2)
    * Math.pow(Math.sin(dx / 2), 2);

  return 2 * Math.asin(Math.sqrt(a)) * 6371;
}

  // TODO handle cases not tested...
export default class CityController {

  public static async getCitiesByTag(ctx: Context): Promise<void> {
    const res = addressArray.filter(address =>
      address.tags.includes(ctx.query.tag as string) && address.isActive === (ctx.query.isActive === 'true'));
    ctx.status = 200;
    ctx.body = {cities: res};
  }


  public static async getDistance(ctx: Context): Promise<void> {
    const fromAddress = addressArray.find(address => address.guid === ctx.query.from);
    const toAddress = addressArray.find(address => address.guid === ctx.query.to);

    if (fromAddress === undefined || toAddress === undefined) {
      ctx.status = 400;
      return;
    }

    ctx.status = 200;
    ctx.body = {
      from: fromAddress,
      to: toAddress,
      unit: 'km',
      distance: +getDistanceFromCoordinates(fromAddress.longitude, fromAddress.latitude, toAddress.longitude, toAddress.latitude).toFixed(2)
    };
  }

  public static async getArea(ctx: Context): Promise<void> {
    const url = 'http://127.0.0.1:8080';
    const distance = ctx.query.distance ?? 0;

    const fromAddress = addressArray.find(address => address.guid === ctx.query.from);
    if (fromAddress === undefined) {
      ctx.status = 400;
      return;
    }

    // Start search process with in this case uuid 2152f96f-50c7-4d76-9e18-f7033bd14428 and return result link...
    const addressesWithinArea = addressArray.filter(address => fromAddress.guid !== address.guid &&
      getDistanceFromCoordinates(fromAddress.longitude, fromAddress.latitude, address.longitude, address.latitude) <= +distance);
    const addressesWithinAreaJSON = JSON.stringify({'2152f96f-50c7-4d76-9e18-f7033bd14428': addressesWithinArea});
    fs.writeFileSync('addresses-within-area.json', addressesWithinAreaJSON);
    const resultLink = `${url}/area-result/2152f96f-50c7-4d76-9e18-f7033bd14428`;
    ctx.status = 202;
    ctx.body = {resultsUrl: resultLink};
  }

  public static async getAreaResult(ctx: Context): Promise<void> {
    const addressesWithinAreaFile = fs.readFileSync('./addresses-within-area.json');
    // @ts-ignore
    const addressesWithinAreaJSON = JSON.parse(addressesWithinAreaFile);
    if (!addressesWithinAreaJSON.hasOwnProperty(ctx.params.id)) {
      ctx.status = 202;
      return;
    }

    ctx.status = 200;
    ctx.body = {cities: addressesWithinAreaJSON[ctx.params.id]};
  }

  public static getAllCities(ctx: Context) {
    ctx.response.set('content-type', 'application/json');
    ctx.body = fs.createReadStream('./addresses.json');
  }
}
