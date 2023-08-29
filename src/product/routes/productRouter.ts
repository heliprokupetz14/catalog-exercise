import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { ProductController } from '../controllers/productController';

const productFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(ProductController);
  
  router.get('/getProduct/:field/:operator/:value', controller.getProduct)
  router.get('/getTextProduct/:field/:operator/:value', controller.getProduct)
  router.get('/allProducts', controller.getAllProducts);
  router.get('/equalType/:field/:operator/:value', controller.getProduct)
  router.get('/equalConsumptionProtocol/:field/:operator/:value', controller.getProduct)
  router.get('/getPolygon/:field/:operator/:value', controller.getProduct)
  router.post('/createProduct', controller.createProduct);
  router.delete('/deleteProduct/:id', controller.deleteProduct);
  router.put('/updateProduct/:id', controller.updateProduct);

  return router;
};

export const PRODUCT_ROUTER_SYMBOL = Symbol('productFactory');

export { productFactory };
