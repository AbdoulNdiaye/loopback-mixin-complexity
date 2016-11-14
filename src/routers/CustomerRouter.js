// @flow

import { Router } from 'express';
import CustomerController from '../controllers/CustomerController';
import { merge } from 'lodash';

const DefaultRouter: Function = function defaultRouter(): Router {
  const router = Router();

  // perhaps expose some API metadata at the root
  router.post(
    '/',
    CustomerController.create,
    CustomerController.setStripeId,
    CustomerController.save,
    CustomerController.billingInfo,
  );

  return router;
};

export default DefaultRouter;
