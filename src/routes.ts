import Router from '@koa/router';
import CityController from './controller/CityController';

const protectedRouter = new Router();
protectedRouter.get('/cities-by-tag', CityController.getCitiesByTag);
protectedRouter.get('/distance', CityController.getDistance);
protectedRouter.get('/area', CityController.getArea);
protectedRouter.get('/area-result/:id', CityController.getAreaResult);
protectedRouter.get('/all-cities', CityController.getAllCities);


const unprotectedRouter = new Router();
unprotectedRouter.get('/', function (ctx, next) {
  ctx.body = 'Hello, World';
});

export {protectedRouter};
export {unprotectedRouter};
