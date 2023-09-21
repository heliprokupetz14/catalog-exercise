/* eslint-disable no-useless-catch */
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { SERVICES } from '../../common/constants';
import { SQLFiltered } from '../../common/interfaces';
import { Product } from '../entities/productEntity';

@injectable()
export class ProductManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<Product>
  ) {}

  public async createProduct(productData: Product): Promise<Product> {
    try {
      return await this.repository.save(productData);
    } catch (error) {
      throw error;
    }
  }

  public async getAllProductsInternal(): Promise<Product[]> {
    try {
      const products = await this.repository.find();
      return products;
    } catch (error) {
      throw error;
    }
  }

  public async deleteProductById(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  public async updateProductById(id: number, dataToUpdate: Partial<Product>): Promise<Product | undefined> {
    try {
      const product = await this.repository.findOneBy({ id });
      if (product) {
        this.repository.merge(product, dataToUpdate);
        return await this.repository.save(product);
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  }

  public async getProductsBySQLFilter(requestBody: SQLFiltered): Promise<Product[]> {
    try {
      const query = `SELECT * FROM products WHERE ${requestBody.field} ${requestBody.operator} '${requestBody.value}'`;
      const products: Product[] = (await this.repository.query(query)) as Product[];
      return products;
    } catch (error) {
      throw error;
    }
  }

  public async queryProductsByPolygon(operator: string, value: unknown): Promise<Product[]> {
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
    this.logger.info(sqlQuery);

    try {
      const products: Product[] = (await this.repository.query(sqlQuery)) as Product[];
      return products;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error({ msg: `Error querying products: ${error.message}` });
      }
      throw new Error();
    }
  }

  public async getById(id: number): Promise<void> {
    try {
      await this.repository.findOneBy({ id });
    } catch (error) {
      throw error;
    }
  }
}
