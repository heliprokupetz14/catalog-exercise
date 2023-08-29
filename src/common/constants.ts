import { readPackageJsonSync } from '@map-colonies/read-pkg';
import { container } from 'tsyringe';
import { ProductType, ConsumptionProtocol } from './enums';
import { createConnection } from "typeorm";
import { Product } from '../product/entities/productEntity';


export const SERVICE_NAME = readPackageJsonSync().name ?? 'unknown_service';
export const DEFAULT_SERVER_PORT = 80;

export const IGNORED_OUTGOING_TRACE_ROUTES = [/^.*\/v1\/metrics.*$/];
export const IGNORED_INCOMING_TRACE_ROUTES = [/^.*\/docs.*$/];

/* eslint-disable @typescript-eslint/naming-convention */
export const SERVICES: Record<string, symbol> = {
  LOGGER: Symbol('Logger'),
  CONFIG: Symbol('Config'),
  TRACER: Symbol('Tracer'),
  METER: Symbol('Meter'),
  DATABASE: Symbol('Database'),
  METADATA_REPOSITORY: Symbol('Database'),
};
/* eslint-enable @typescript-eslint/naming-convention */


export const productSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 48 },
    description: { type: 'string' },
    boundingPolygon: {
      type: 'object',
      properties: {
        type: { type: 'P', enum: ['Polygon'] },
        coordinates: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
      },
      required: ['type', 'coordinates'],
    },
    consumtionLink: { type: 'string' },
    type: { type: 'string', enum: Object.values(ProductType) },
    consumptionProtocol: { type: 'string', enum: Object.values(ConsumptionProtocol) },
    resolutionBest: { type: 'number' },
    minZoom: { type: 'integer' },
    maxZoom: { type: 'integer' },
  },
  required: ['name', 'description', 'boundingPolygon', 'consumtionLink', 'type', 'consumptionProtocol', 'resolutionBest', 'minZoom', 'maxZoom'],
};

export const connection = createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "catalog",
  entities: [Product],
});
