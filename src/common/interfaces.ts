import { GeoJSON } from 'typeorm';
import { ConsumptionProtocol, Operators, ProductType, GeoOperators } from './enums';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export interface SQLFiltered {
  field: string;
  operator: string;
  value: string | number;
}

export interface GeoSchema {
  field: string;
  operator: GeoOperators;
  value: unknown;
}

export interface PingResponse {
  message: string;
}