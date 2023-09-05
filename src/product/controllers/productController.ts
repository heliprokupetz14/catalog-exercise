import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ProductManager } from '../models/productManager';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { GeoSchema, SQLFiltered } from '../../common/interfaces';
import { Operators } from '../../common/enums';
import { Product } from '../entities/productEntity';

type GetProductHandler = RequestHandler<SQLFiltered, Product[]>;
type GetGeoProductHandler = RequestHandler<GeoSchema, Product[]>;

@injectable()
export class ProductController {
  // private readonly createdProductCounter: BoundCounter;

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Product>,
    @inject(ProductManager) private readonly manager: ProductManager
  ) {}

  public createProduct = async (req: Request, res: Response) => {
    const productData: Product = req.body;

    try {
      const newProduct = this.manager.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      this.logger.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getAllProducts = async (req: Request, res: Response) => {
    try {
      const products: Product[] = await this.manager.getAllProductsInternal();
      return res.send(products);
    } catch (error) {
      this.logger.error('Error updating Product:', error);
      throw new Error('Interval server error');
    }
  };

  public deleteProduct = async (req: Request, res: Response) => {
    const productId: number = parseInt(req.params.id);
    try {
      this.manager.deleteProductById(productId);
      res.json({
        message: 'success',
      });
    } catch (error) {
      this.logger.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateProduct = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
      const updatedProduct = await this.manager.updateProductById(id, req.body);
      if (updatedProduct) {
        res.json({
          message: 'success',
          payload: updatedProduct,
        });
      } else {
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error) {
      this.logger.error('Error updating product', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getProduct: GetProductHandler = async (req, res, next) => {
    const requestBody: SQLFiltered = {
      field: req.params.field,
      operator: Object.values(Operators)[Object.keys(Operators).indexOf(req.params.operator)],
      value: req.params.value,
    };
    try {
      console.log(typeof requestBody.value);
      const products: Product[] = await this.manager.getProductsBySQLFilter(requestBody);
      return res.status(200).json(products);
    } catch (error) {
      this.logger.error('Error retrieving products', error);
      return next(error);
    }
  };

  public postPolygonProduct: GetProductHandler = async (req, res, next) => {
    const { operator, value } = req.body;

    try {
      const products = await this.manager.queryProductsByPolygon(operator, value);
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error querying products:', error);
      this.logger.error('Error retrieving products', error);
    }
  };
}
