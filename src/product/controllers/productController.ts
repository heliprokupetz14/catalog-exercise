import { Logger } from '@map-colonies/js-logger';
// import { BoundCounter, Meter } from '@opentelemetry/api-metrics';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
// import { ProductManager } from '../models/productManager';
import { Request, Response } from 'express';
import { EntityManager, getConnection, getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities/productEntity';
import { GeoSchema, SQLFiltered } from '../../common/interfaces';
import { GeoOperators } from '../../common/enums';
import { promises } from 'dns';
import { InjectRepository } from '@nestjs/typeorm';

type CreateProductHandler = RequestHandler<undefined, Product, Product>;
type GetProductHandler = RequestHandler<SQLFiltered, Product[]>;
type GetGeoProductHandler = RequestHandler<GeoSchema, Product[]>;


@injectable()
export class ProductController {
  // private readonly createdProductCounter: BoundCounter;

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Product>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,

    // @inject(ProductManager) private readonly manager: ProductManager,
    // @inject(SERVICES.METER) private readonly meter: Meter
  ) {
    // this.createdProductCounter = meter.createCounter('created_product');
  }

    

    public createProduct = async (req: Request, res: Response) => {
      const productData: Product = req.body;

      try {
        const newProduct = this.repository.save(productData);
        res.status(201).json(newProduct);
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: 'Internal server error'});
      }
    };

    public getAllProducts = async (req:Request, res:Response) => {
      const productRepository = getRepository(Product);
      
      const products = await productRepository.find()
      res.send(products)
    }

    public deleteProduct = async (req: Request, res: Response) => {
      const productRepository = getRepository(Product);
      try {
      const product = productRepository.delete(req.params.id)
      res.json({
          message: "success"
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: 'Internal server error'});
    }

    }

    public updateProduct = async (req: Request, res: Response) => {
      const productRepository = getRepository(Product);
      const id: number = parseInt(req.params.id, 10)
      try {
      const product = await productRepository.findOneBy({id: id})
      if(product !== null){
          productRepository.merge(product, req.body);
          const result = await productRepository.save(product);
          res.json({
              message: "success",
              payload: result
          })
      }
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: 'Internal server error'});
    }
  }


    public getProduct: GetProductHandler = async (req, res, next) => {
      const requestBody: SQLFiltered = req.params;
      try {
        const products: Product[] = await this.repository.find();
        // .createQueryBuilder('product')
        // .where(`product.${requestrepositoryody.field} ${requestBody.operator} :value`, { value: requestBody.value})
        // .getMany();

        return res.status(200).json(products);
      } catch (error) {
        console.error('Error retrieving products', error);
        return next(error);
        // res.status(500).json({ error: 'Internal server error' });
      }
    };
  

  private getGeoOperator(operator: GeoOperators, value: any): string {
      switch (operator) {
        case 'contains':
          return `ST_Contains(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        case 'within':
          return `ST_Within(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        case 'intersects':
          return `ST_Intersects(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        default:
          throw new Error(`Unsupported geo operation: ${operator}`);
    }
  }

  
  public getPolygonProduct: GetGeoProductHandler = async (req, res, next) => {
    const requestBody: GeoSchema = req.params;
    try {
      const geoOperator = this.getGeoOperator(requestBody.operator, requestBody.value);

      const products = await this.repository
        .createQueryBuilder('product')
        .where(geoOperator)
        .getMany();

      res.status(200).json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      next(error);
    }
  };
}

