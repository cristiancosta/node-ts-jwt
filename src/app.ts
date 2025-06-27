import express, { Request, Response } from 'express';

const createExpressApp = () => {
  const app = express();
 
  app.get('/', (req, res) => res.send({ message: 'Hello node-ts-jwt not js' }));

  return app;
};

export default createExpressApp;
