import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { Product, SQLFiltered } from '../../common/interfaces';
import { DataSource, Repository, createConnection } from 'typeorm';
import { Connection } from 'pg';
import compression from 'compression';
import { createContextKey } from '@opentelemetry/api';
import { GeoOperators } from '../../common/enums';
import { FindOperator } from 'typeorm';

function generateRandomId(): number {
  const rangeOfIds = 100;
  return Math.floor(Math.random() * rangeOfIds);
}


// private getGeoOperator(operator: GeoOperators, value: any): string {
//   switch (operator) {
//     case 'contains':
//       return `ST_Contains(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
//     case 'within':
//       return `ST_Within(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
//     case 'intersects':
//       return `ST_Intersects(product.boundingPolygon, ST_GeomFromGeoJSON('${JSON.stringify(value)}'))`;
//     default:
//       throw new Error(`Unsupported geo operation: ${operator}`);
//   }
// }

// @injectable()
// export class ProductManager {  
//   private productRepository!: Repository<Product>;

//   public constructor(
//     @inject(SERVICES.LOGGER) private readonly logger: Logger,
//     @inject(SERVICES.DATABASE) private readonly db: Promise<DataSource>, 
//     ){
//       this.init();
//     }


//   private async init() {
//     try {
//     const connection = await this.db;
//     this.logger.info({ msg: '🌴 Database is connected!' });
//     } catch (error) {
//       this.logger.info({ msg: 'Error connecting to database:', error });
//       throw error;
//     }
    
//   }

//   public createProduct(product: Product): Product {
//       const ProductId = generateRandomId();
//       this.logger.info({ msg: 'creating product', ProductId });

//       return product;
//     }
    
//   public getProduct(): Product {
//     const awaitedDB = await this.db;
//     this.logger.info({ msg: 'getting product'});
//     const requestBody: SQLFiltered = req.body

//     const query = `SELECT * FROM products WHERE ${requestBody.field} ${requestBody.operator} ${requestBody.value}`;
//     const result = await (await this.db)db.query(query, [requestBody.value]);
//     filteredProducts = result.rows;

//     return product;
//   }

// }
