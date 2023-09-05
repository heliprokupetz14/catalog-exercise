import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { SQLFiltered } from '../../common/interfaces';
import {  LessThan, Repository } from 'typeorm';
import { GeoOperators } from '../../common/enums';
import { Product } from '../entities/productEntity';
;

function generateRandomId(): number {
  const rangeOfIds = 100;
  return Math.floor(Math.random() * rangeOfIds);
}

@injectable()
export class ProductManager {
  static getResource() {
    throw new Error('Method not implemented.');
  }

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Product>
  ) {}

  public getGeoOperator(operator: GeoOperators, value: any): string {
    switch (operator) {
      case 'contains':
        return `ST_Contains(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
      case 'within':
        return `ST_Within(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
      case 'intersects':
        return `ST_Intersects(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
      default:
        throw new Error(`Unsupported geo operation: ${operator}`);
    };
  };

  public async createProduct(productData: Product): Promise<Product> {
    try {
      return await this.repository.save(productData);
    } catch (error) {
      throw error;
    };
  };

  public async getAllProductsInternal(): Promise<Product[]> {
    try {
      const products = await this.repository.find();
      return products;
    } catch (error) {
      throw error;
    };
  };

  public async deleteProductById(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    };
  };

  public async updateProductById(id: number, dataToUpdate: Partial<Product>): Promise<Product | undefined> {
    try {
      const product = await this.repository.findOneBy({ id });
      if (product) {
        this.repository.merge(product, dataToUpdate);
        return this.repository.save(product);
      }
      return undefined;
    } catch (error) {
      throw error;
    };
  };

  public async getProductsBySQLFilter(requestBody: SQLFiltered): Promise<Product[]> {
    try {
      const query = `SELECT * FROM products WHERE ${requestBody.field} ${requestBody.operator} '${requestBody.value}'`;
      const products: Product[] = await this.repository.query(query);
      return products;
    } catch (error) {
      throw error;
    };
  };


  public async queryProductsByPolygon(operator: string, value: any): Promise<Product[]> {
    let sqlQuery = '';
    switch (operator) {
      case 'contains':
        sqlQuery = `SELECT * FROM products WHERE ST_Contains(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        break;
      case 'within':
        sqlQuery = `SELECT * FROM products WHERE ST_Within(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        break;
      case 'intersects':
        sqlQuery = `SELECT * FROM products WHERE ST_Intersects(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
        break;
      default:
        throw new Error(`Unsupported geo operation: ${operator}`);
    }
    this.logger.info(sqlQuery)

    try {
      const products = await this.repository.query(sqlQuery);
      return products;
    } catch (error) {
      throw new Error(`Error querying products: ${error}`);
    }
  }
}
