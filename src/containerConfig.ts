import config from 'config';
import { getOtelMixin } from '@map-colonies/telemetry';
import { trace, metrics as OtelMetrics } from '@opentelemetry/api';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import jsLogger, { LoggerOptions } from '@map-colonies/js-logger';
import { Metrics } from '@map-colonies/telemetry';
import { DataSourceOptions, DataSource } from 'typeorm';
import { SERVICES, SERVICE_NAME } from './common/constants';
import { tracing } from './common/tracing';
import { productFactory, PRODUCT_ROUTER_SYMBOL } from './product/routes/productRouter';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';
import { Product } from './product/entities/productEntity';
import { DBFromConfig } from './common/interfaces';

export const ENTITIES_DIRS = [Product, 'src/product/entities/*.ts'];

export interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = async (options?: RegisterOptions): Promise<DependencyContainer> => {
  const loggerConfig = config.get<LoggerOptions>('telemetry.logger');
  const logger = jsLogger({ ...loggerConfig, prettyPrint: loggerConfig.prettyPrint, mixin: getOtelMixin() });
  const dbConfig = config.get<DBFromConfig>('db');
  const trash: DataSourceOptions = {
    host: dbConfig.host,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    type: 'postgres',
  };
  process.on('uncaughtException', (e) => {
    console.log(e.stack);
    process.exit();
  });
  console.log(trash);
  const dbConnection = new DataSource({ entities: ENTITIES_DIRS, ...trash });

  await dbConnection.initialize();

  const metrics = new Metrics();
  metrics.start();

  tracing.start();
  const tracer = trace.getTracer(SERVICE_NAME);

  const dependencies: InjectionObject<unknown>[] = [
    { token: SERVICES.CONFIG, provider: { useValue: config } },
    { token: SERVICES.LOGGER, provider: { useValue: logger } },
    { token: SERVICES.TRACER, provider: { useValue: tracer } },
    { token: SERVICES.METER, provider: { useValue: OtelMetrics.getMeterProvider().getMeter(SERVICE_NAME) } },
    { token: PRODUCT_ROUTER_SYMBOL, provider: { useFactory: productFactory } },
    { token: SERVICES.METADATA_REPOSITORY, provider: { useValue: dbConnection.getRepository(Product) } },
    {
      token: 'onSignal',
      provider: {
        useValue: {
          useValue: async (): Promise<void> => {
            await Promise.all([tracing.stop(), metrics.stop()]);
          },
        },
      },
    },
  ];

  return registerDependencies(dependencies, options?.override, options?.useChild);
};
