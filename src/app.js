import 'dotenv/config';

import express from 'express';
import 'express-async-error';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';


import router from './router';
import sentryConfig from './config/sentry';

import './database';


class App {
  // construtor é chamado automaticamente sempre que a classe App for chamado
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.router();
    this.exceptionHandle();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
        '/files',
        express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
}

  router() {
    this.server.use(router);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandle(){
      this.server.use(async (err,req,res,next) => {
        if (process.env.NODE_ENV == 'development'){
            const errors = await new Youch(err,req).toJSON();

            return res.status(500).json(errors);
        }
        return res.status(500).json("Internal server error.");
      })

        // this.server.use(function onError(err, req, res, next) {
            // The error id is attached to `res.sentry` to be returned
            // and optionally displayed to the user for support.
            // res.statusCode = 500;
            // res.end(res.sentry + "\n");
        // });
    }
}

export default new App().server;
