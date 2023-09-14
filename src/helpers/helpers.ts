import { faker } from '@faker-js/faker';
import { Product } from '../product/entities/productEntity';
import { ProductType, ConsumptionProtocol } from '../product/../common/enums';

export function getRandomEnumValue<T>(enumObj: Record<string, T>): T {
  const enumValues = Object.values(enumObj);
  const randomIndex = faker.datatype.number({ min: 0, max: enumValues.length - 1 });
  return enumValues[randomIndex];
}

export function createFakeProduct(): Product {
  const fakeProduct: Product = {
    id: faker.datatype.number(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    boundingPolygon: {
      type: 'Polygon',
      coordinates: [
        [
          [
            faker.datatype.float({ min: -180, max: 180, precision: 0.0001 }), // Random longitude
            faker.datatype.float({ min: -90, max: 90, precision: 0.0001 }), // Random latitude
          ],
        ],
      ],
    },
    consumtionLink: faker.internet.url(),
    type: getRandomEnumValue(ProductType),
    consumptionProtocol: getRandomEnumValue(ConsumptionProtocol),
    resolutionBest: faker.datatype.number({ min: 1, max: 100 }),
    minZoom: faker.datatype.number({ min: 1, max: 10 }),
    maxZoom: faker.datatype.number({ min: 11, max: 20 }),
  };

  return fakeProduct;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createFakeEntity() {
  const fakeProduct: Product = {
    id: faker.datatype.number(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    boundingPolygon: {
      type: 'Polygon',
      coordinates: [
        [
          [faker.datatype.number({ min: -180, max: 180, precision: 0.000001 }), faker.datatype.number({ min: -90, max: 90, precision: 0.000001 })],
          [faker.datatype.number({ min: -180, max: 180, precision: 0.000001 }), faker.datatype.number({ min: -90, max: 90, precision: 0.000001 })],
          // Add more coordinates as needed
        ],
      ],
    },
    consumtionLink: faker.internet.url(),
    type: getRandomEnumValue(ProductType),
    consumptionProtocol: getRandomEnumValue(ConsumptionProtocol),
    resolutionBest: faker.datatype.float({ min: 0, max: 100, precision: 0.01 }),
    minZoom: faker.datatype.number({ min: 0, max: 20 }),
    maxZoom: faker.datatype.number({ min: 0, max: 20 }),
  };
  return fakeProduct;
}
