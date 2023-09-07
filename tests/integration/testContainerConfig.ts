import { container } from 'tsyringe';
import config from 'config';
import jsLogger from '@map-colonies/js-logger';
import { Connection, DataSourceOptions, createConnection } from 'typeorm';
import { SERVICES } from '../../src/common/constants';
import { Product } from '../../src/product/entities/productEntity';
import { ENTITIES_DIRS } from '../../src/containerConfig';


async function registerTestValues(): Promise<void> {
    container.register(SERVICES.CONFIG, {useValue: config });
    container.register(SERVICES.LOGGER, {useValue: jsLogger({ enabled: false }) });

    const dbConfig = config.get<DataSourceOptions>('test');
    const connection = await createConnection({ entities: ENTITIES_DIRS, ...dbConfig });
    await connection.synchronize();
    const repository = connection.getRepository(Product);
    container.register(Connection, { useValue: connection });
    container.register(SERVICES.METADATA_REPOSITORY, { useValue: repository });
};

export { registerTestValues };