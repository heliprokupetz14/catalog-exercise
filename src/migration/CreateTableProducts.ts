// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class CreateTableProducts1612345678901 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//       CREATE TABLE "products" (
//         "id" SERIAL PRIMARY KEY,
//         "name" text NOT NULL,
//         "description" text NOT NULL,
//         "bounding_polygon" geometry(Geometry, 4326) NOT NULL,
//         "consumption_link" text NOT NULL,
//         "type" text NOT NULL,
//         "consumption_protocol" text NOT NULL,
//         "resolution_best" real NOT NULL,
//         "min_zoom" integer NOT NULL,
//         "max_zoom" integer NOT NULL
//       )
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query('DROP TABLE "products"');
//   }
// }
