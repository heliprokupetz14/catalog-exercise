import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { ProductModel, SQLFiltered } from '../../common/interfaces';
import {  LessThan, Repository } from 'typeorm';
import { GeoOperators } from '../../common/enums';
;

function generateRandomId(): number {
  const rangeOfIds = 100;
  return Math.floor(Math.random() * rangeOfIds);
}

@injectable()
export class ProductManager {
  private productRepository!: Repository<ProductModel>;

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METADATA_REPOSITORY) private readonly repository: Repository<ProductModel>
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

  public async createProduct(productData: ProductModel): Promise<ProductModel> {
    try {
      return await this.repository.save(productData);
    } catch (error) {
      throw error;
    };
  };

  public async getAllProductsInternal(): Promise<ProductModel[]> {
    try {
      return await this.repository.find();
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

  public async updateProductById(id: number, dataToUpdate: Partial<ProductModel>): Promise<ProductModel | undefined> {
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

  public async getProductsBySQLFilter(requestBody: SQLFiltered): Promise<ProductModel[]> {
    try {
      const query = `SELECT * FROM products WHERE ${requestBody.field} ${requestBody.operator} '${requestBody.value}'`;
      const products: ProductModel[] = await this.repository.query(query);
      // find({
      //   where: {
      //     [requestBody.field]: LessThan(requestBody.value),
      //   },
      // });
      return products;
    } catch (error) {
      throw error;
    };
  };


  public async queryProductsByPolygon(operator: string, value: any): Promise<ProductModel[]> {
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
