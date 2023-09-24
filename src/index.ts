import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import {protectedRouter, unprotectedRouter} from './routes';
import addresses from '../addresses.json';

export interface Address {
  'guid': string,
  'isActive': boolean,
  'address': string,
  'latitude': number,
  'longitude': number,
  'tags': string[]
}

const addressArray: Address[] = addresses as Address[];

const app = new Koa();

// Enable cors with default options
app.use(cors());
// Enable bodyParser with default options
app.use(bodyParser());

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

app.use(unprotectedRouter.routes());

app.use(jwt({secret: ''}).unless({custom: ctx => ctx.header.authorization === 'bearer dGhlc2VjcmV0dG9rZW4='}));

app.use(protectedRouter.routes());

app.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});


export {addressArray};
