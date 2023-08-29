import { ConsumptionProtocol, Operators, ProductType, GeoOperators} from './enums';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
};

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
};

export interface BoundingPolygon {
  type: string;
  coordinates: number[][];
};

export interface Product {
  id: number;
  name: string;
  description: string;
  boundingPolygon: BoundingPolygon;
  consumtionLink: string;
  type: ProductType;
  consumptionProtocol: ConsumptionProtocol;
  resolutionBest: number;
  minZoom: number;
  maxZoom: number;
};

export interface SQLFiltered {
  field: string;
  operator: Operators;
  value: unknown;
  
};

export interface GeoSchema {
  field: string;
  operator: GeoOperators;
  value: unknown;
  
};

export interface PingResponse {
  message: string;
};

export interface DbConfig {
  type: "postgres";
  username: 'postgres';
  password: 'postgres';
  host: 'localhost';
  port: 5432;
  database: 'catalog';
  
  
};
