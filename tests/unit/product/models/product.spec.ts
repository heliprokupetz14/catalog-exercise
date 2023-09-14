/* eslint-disable jest/no-identical-title */
import jsLogger from '@map-colonies/js-logger';
import { Repository } from 'typeorm';
import { ConsumptionProtocol, ProductType } from '../../../../src/common/enums';
import { ProductManager } from '../../../../src/product/models/productManager';
import { Product } from '../../../../src/product/entities/productEntity';
import { validProduct } from '../../../mocks/productMock';
import { SQLFiltered } from '../../../../src/common/interfaces';

describe('ProductManager', () => {
  const repositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    query: jest.fn(),
  };

  const productManager = new ProductManager(jsLogger({ enabled: false }), repositoryMock as unknown as Repository<Product>);

  describe('ProductManager', () => {
    describe('createProduct', () => {
      it('Should create a new product and return it', async () => {
        const productMockData: Product = {
          id: 1,
          name: 'another home',
          description: 'not my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532161961821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.raster,
          consumptionProtocol: ConsumptionProtocol.WMS,
          resolutionBest: 14,
          minZoom: 6,
          maxZoom: 11,
        };

        repositoryMock.save.mockResolvedValue(validProduct);
        const result = await productManager.createProduct(productMockData);

        expect(result).toEqual(validProduct);
        expect(repositoryMock.save).toHaveBeenCalledWith(productMockData);
      });
    });

    describe('getAllProductsInternal', () => {
      it('Should return a list of products', async () => {
        const sampleProducts: Product[] = [
          {
            id: 1,
            name: 'another home',
            description: 'not my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532161961821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.raster,
            consumptionProtocol: ConsumptionProtocol.WMS,
            resolutionBest: 14,
            minZoom: 6,
            maxZoom: 11,
          },
          {
            id: 2,
            name: ' home',
            description: ' my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532145261821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.QMesh,
            consumptionProtocol: ConsumptionProtocol.XYZ,
            resolutionBest: 16,
            minZoom: 5,
            maxZoom: 10,
          },
        ];

        repositoryMock.find.mockResolvedValue(sampleProducts);
        const products = await productManager.getAllProductsInternal();

        expect(Array.isArray(products)).toBe(true);
        expect(products).toEqual(sampleProducts);
      });
    });

    describe('deleteProductById', () => {
      it('Should delete a product by ID', async () => {
        const productIdToDelete = 1;

        repositoryMock.delete.mockResolvedValue(undefined);
        await productManager.deleteProductById(productIdToDelete);

        expect(repositoryMock.delete).toHaveBeenCalledWith(productIdToDelete);
      });
    });

    describe('updateProductById', () => {
      it('Should update a product by ID', async () => {
        const productIdToDelete = 1;

        const dataToUpdate: Product = {
          id: 2,
          name: ' updated',
          description: ' my updated',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532145261821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.raster,
          consumptionProtocol: ConsumptionProtocol.Tiles3D,
          resolutionBest: 35,
          minZoom: 5,
          maxZoom: 10,
        };

        const productToUpdate: Product = {
          id: 2,
          name: ' home',
          description: ' my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532145261821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.QMesh,
          consumptionProtocol: ConsumptionProtocol.XYZ,
          resolutionBest: 16,
          minZoom: 5,
          maxZoom: 10,
        };

        repositoryMock.findOneBy.mockResolvedValue(productToUpdate);
        repositoryMock.save.mockResolvedValue({ ...productToUpdate, ...dataToUpdate });

        const updatedProduct = await productManager.updateProductById(productIdToDelete, dataToUpdate);
        expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: productIdToDelete });
        expect(repositoryMock.merge).toHaveBeenCalledWith(productToUpdate, dataToUpdate);
        expect(repositoryMock.save).toHaveBeenCalledWith(productToUpdate);
        expect(updatedProduct).toEqual({ ...productToUpdate, ...dataToUpdate });
      });
    });

    describe('getProductsBySQLFilter', () => {
      it('Should retrieve products based on SQL filter', async () => {
        const requestBody: SQLFiltered = {
          field: 'name',
          operator: '=',
          value: 'Sample Product Name',
        };

        const expectQuery = `SELECT * FROM products WHERE ${requestBody.field} ${requestBody.operator} '${requestBody.value}'`;
        const sampleProducts: Product[] = [
          {
            id: 2,
            name: ' home',
            description: ' my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532145261821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.QMesh,
            consumptionProtocol: ConsumptionProtocol.XYZ,
            resolutionBest: 16,
            minZoom: 5,
            maxZoom: 10,
          },
          {
            id: 2,
            name: 'no home',
            description: ' my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532185261821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.rasterizedvector,
            consumptionProtocol: ConsumptionProtocol.WMS,
            resolutionBest: 16,
            minZoom: 5,
            maxZoom: 9,
          },
        ];
        repositoryMock.query.mockResolvedValue(sampleProducts);

        const filteredProducts = await productManager.getProductsBySQLFilter(requestBody);
        expect(repositoryMock.query).toHaveBeenCalledWith(expectQuery);
        expect(filteredProducts).toEqual(sampleProducts);
      });
    });

    describe('queryProductsByPolygon', () => {
      it('Should query products by polygn with the "contains" operator', async () => {
        const operator = 'contains';
        const polygnValue = {
          type: 'Polygon',
          coordinates: [
            [
              [35.02482546066713, 31.9049648768097],
              [35.02482546066713, 31.904387420397512],
              [35.02532161961821, 31.904387420397512],
              [35.02532161961821, 31.9049648768097],
              [35.02482546066713, 31.9049648768097],
            ],
          ],
        };
        const expectQuery = `SELECT * FROM products WHERE ST_Contains(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(polygnValue)}'))`;

        const sampleProducts: Product[] = [
          {
            id: 1,
            name: 'another home',
            description: 'not my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532161961821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.raster,
            consumptionProtocol: ConsumptionProtocol.WMS,
            resolutionBest: 14,
            minZoom: 6,
            maxZoom: 11,
          },
          {
            id: 2,
            name: ' home',
            description: ' my home',
            boundingPolygon: {
              type: 'Polygon',
              coordinates: [
                [
                  [35.02482546066713, 31.9049648768097],
                  [35.02482546066713, 31.904387420397512],
                  [35.02532145261821, 31.904387420397512],
                  [35.02532161961821, 31.9049648768097],
                  [35.02482546066713, 31.9049648768097],
                ],
              ],
            },
            consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
            type: ProductType.QMesh,
            consumptionProtocol: ConsumptionProtocol.XYZ,
            resolutionBest: 16,
            minZoom: 5,
            maxZoom: 10,
          },
        ];
        repositoryMock.query.mockResolvedValue(sampleProducts);
        const queryProducts = await productManager.queryProductsByPolygon(operator, polygnValue);

        expect(repositoryMock.query).toHaveBeenCalledWith(expectQuery);
        expect(queryProducts).toEqual(sampleProducts);
      });
    });
  });

  describe('queryProductsByPolygon', () => {
    it('Should query products by polygn with the "within" operator', async () => {
      const operator = 'within';
      const polygnValue = {
        type: 'Polygon',
        coordinates: [
          [
            [35.02482546066713, 31.9049648768097],
            [35.02482546066713, 31.904387420397512],
            [35.02532161961821, 31.904387420397512],
            [35.02532161961821, 31.9049648768097],
            [35.02482546066713, 31.9049648768097],
          ],
        ],
      };
      const expectQuery = `SELECT * FROM products WHERE ST_Within(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(polygnValue)}'))`;

      const sampleProducts: Product[] = [
        {
          id: 1,
          name: 'another home',
          description: 'not my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532161961821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.raster,
          consumptionProtocol: ConsumptionProtocol.WMS,
          resolutionBest: 14,
          minZoom: 6,
          maxZoom: 11,
        },
        {
          id: 2,
          name: ' home',
          description: ' my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532145261821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.QMesh,
          consumptionProtocol: ConsumptionProtocol.XYZ,
          resolutionBest: 16,
          minZoom: 5,
          maxZoom: 10,
        },
      ];
      repositoryMock.query.mockResolvedValue(sampleProducts);
      const queryProducts = await productManager.queryProductsByPolygon(operator, polygnValue);

      expect(repositoryMock.query).toHaveBeenCalledWith(expectQuery);
      expect(queryProducts).toEqual(sampleProducts);
    });
  });

  describe('queryProductsByPolygon', () => {
    it('Should query products by polygn with the "intersects" operator', async () => {
      const operator = 'intersects';
      const polygnValue = {
        type: 'Polygon',
        coordinates: [
          [
            [35.02482546066713, 31.9049648768097],
            [35.02482546066713, 31.904387420397512],
            [35.02532161961821, 31.904387420397512],
            [35.02532161961821, 31.9049648768097],
            [35.02482546066713, 31.9049648768097],
          ],
        ],
      };
      const expectQuery = `SELECT * FROM products WHERE ST_Intersects(bounding_polygon, ST_GeomFromGeoJSON('${JSON.stringify(polygnValue)}'))`;

      const sampleProducts: Product[] = [
        {
          id: 1,
          name: 'another home',
          description: 'not my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532161961821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.raster,
          consumptionProtocol: ConsumptionProtocol.WMS,
          resolutionBest: 14,
          minZoom: 6,
          maxZoom: 11,
        },
        {
          id: 2,
          name: ' home',
          description: ' my home',
          boundingPolygon: {
            type: 'Polygon',
            coordinates: [
              [
                [35.02482546066713, 31.9049648768097],
                [35.02482546066713, 31.904387420397512],
                [35.02532145261821, 31.904387420397512],
                [35.02532161961821, 31.9049648768097],
                [35.02482546066713, 31.9049648768097],
              ],
            ],
          },
          consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
          type: ProductType.QMesh,
          consumptionProtocol: ConsumptionProtocol.XYZ,
          resolutionBest: 16,
          minZoom: 5,
          maxZoom: 10,
        },
      ];
      repositoryMock.query.mockResolvedValue(sampleProducts);
      const queryProducts = await productManager.queryProductsByPolygon(operator, polygnValue);

      expect(repositoryMock.query).toHaveBeenCalledWith(expectQuery);
      expect(queryProducts).toEqual(sampleProducts);
    });
  });
});
