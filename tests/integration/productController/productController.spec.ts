import jsLogger from '@map-colonies/js-logger';
import httpStatusCodes from 'http-status-codes';
import { SERVICES } from '../../../src/common/constants';
import * as requestSender from '../requestSender'
import { Application } from 'express';
import { Connection, DataSourceOptions, QueryFailedError, createConnection } from 'typeorm';
import { container } from 'tsyringe';
import config from 'config';
import { ENTITIES_DIRS } from '../../../src/containerConfig';
import { Product } from '../../../src/product/entities/productEntity';
import {createFakeEntity, createFakeProduct, getRandomEnumValue} from '../../../src/helpers/helpers'
import { GeoOperators, Operators } from '../../../src/common/enums';
import { SQLFiltered } from '../../../src/common/interfaces';


  describe('ProductController', function () {
    let app: Application;
    let connection: Connection;

    beforeAll(async function () {
      container.register(SERVICES.CONFIG, { useValue: config});
      container.register(SERVICES.LOGGER, { useValue: jsLogger({ enabled: false }) });

      const dbConfig = config.get<DataSourceOptions>('test');
      const connection = await createConnection({ entities: ENTITIES_DIRS, ...dbConfig }); 

      await connection.synchronize();
      const repository = connection.getRepository(Product);

      container.register(Connection, { useValue: connection });
      container.register(SERVICES.METADATA_REPOSITORY, { useValue: repository });

      app = requestSender.getApp();
    });

    afterAll(async function () {
      await connection.close();
    });

    describe('GET/product/allProducts', function() {
      describe('Happy Path 🙂', function () {
        it('should return 204 if there are no metadata records', async function () {
          const response = await requestSender.getAllProducts(app);

          expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
        });

        it('should return 200 status code and products list', async function () {
          const product: Product = createFakeProduct();

          const createResponse = await requestSender.createProduct(app, product);
          expect(createResponse.headers).toHaveProperty('content-type', 'application/json;');
          const response = await requestSender.getAllProducts(app);

          expect(response.status).toBe(httpStatusCodes.OK);
          expect(response.headers).toHaveProperty('content-type', 'application/json;');
          expect(response.body).toHaveLength(1);

          const { name, description, boundingPolygon, type, ...createResponseWithoutAnyText } = createResponse.body as unknown as Product;
          expect(response.body).toMatchObject([createResponseWithoutAnyText]);
        });

        describe('Sad Path 😥', function () {
          it('should return 500 status code if a db exception happens', async function () {
            const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
            const mockedApp = requestSender.getMockRepoApp({ find: findMock });
    
            const response = await requestSender.getAllProducts(mockedApp);
    
            expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body).toHaveProperty('message', 'failed');
          });
        });
      });

    describe('POST/product/createProduct', function() {
      describe('Happy Path 🙂', function () {
        it('if productId not exists, should return 201 status code and the added product', async function () {
          const product: Product = createFakeProduct();
          const response = await requestSender.createProduct(app, product);
          expect(response.status).toBe(httpStatusCodes.CREATED);
          expect(response.headers).toHaveProperty('content-type', 'application/json');

          const body = response.body as unknown as Product;
          const getResponse = await requestSender.getById(app, product.id);
          const { name, description, boundingPolygon, type, ...createdResponseBody } = body;

          expect(getResponse.body).toMatchObject(createdResponseBody);
        });
    });

      it('should return 500 status code if a db exception happens', async function () {
        const product = createFakeProduct();
        const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockRepoApp({ findOne: findMock });

        const response = await requestSender.createProduct(mockedApp, product);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });

  describe('PUT /product/updateProduct/{id}', function () {
      describe('Happy Path 🙂', function () {
        it('should return 200 status code and the updated metadata record', async function () {
          const entity = createFakeEntity();
          const findMock = jest.fn().mockResolvedValue(entity);
          const saveMock = jest.fn().mockResolvedValue(entity);
          const mockedApp = requestSender.getMockRepoApp({ findOne: findMock, save: saveMock });
          const response = await requestSender.updatedProduct(mockedApp, entity.id, entity);

          expect(response.status).toBe(httpStatusCodes.OK);
          expect(response.headers).toHaveProperty('content-type', 'application/json; charset=utf-8');
        });
      });

        it('should return 500 status code if a db exception happens', async function () {
          const entity = createFakeEntity();
          const findMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
          const mockedApp = requestSender.getMockRepoApp({ findOne: findMock });

          const response = await requestSender.updatedProduct(mockedApp, entity.id, entity);

          expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
          expect(response.body).toHaveProperty('message', 'failed');
        });
      });

  describe('DELETE/deleteProduct/{id}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 status code if product to be deleted was not in the database', async function () {
        const response = await requestSender.deleteProduct(app, 1);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });

      it('should return 204 status code if the product was found and deleted successfully', async function () {
        const product = createFakeProduct();
        const created = await requestSender.deleteProduct(app, product.id);
        const data = created.body as Product;

        const response = await requestSender.deleteProduct(app, data.id);

        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });
    });
    describe('Sad Path 😥', function () {
      it('should return 500 status code if a db exception happens', async function () {
        const deleteMock = jest.fn().mockRejectedValue(new QueryFailedError('select *', [], new Error('failed')));
        const mockedApp = requestSender.getMockRepoApp({ delete: deleteMock });

        const response = await requestSender.deleteProduct(mockedApp, 1);

        expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).toHaveProperty('message', 'failed');
      });
    });
  });


  describe('POST/product/postPolygon', function() {
    describe('Happy Path 🙂', function() {
      it('should return 200 status code and products list', async function() {
        const requestBody = {
          operator: getRandomEnumValue(GeoOperators),
          value: [
            [35.02482546066713, 31.9049648768097],
            [35.02482546066713, 31.904387420397512],
            [35.02532145261821, 31.904387420397512],
            [35.02532161961821, 31.9049648768097],
            [35.02482546066713, 31.9049648768097],
          ]
        };
  
        const response = await requestSender.postPolygon(app, requestBody);
  
        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json;');  
      });
    });
  
  describe('Sad Path 😥', function() {
    it('should return 500 status code if a database error occurs', async function () {
      const queryProductsByPOolygonMock = jest.fn().mockRejectedValue(new Error('Database error'));
      const MockApp = requestSender.getMockRepoApp({queryProductsByPolygon: queryProductsByPOolygonMock});

      const requestBody = {
        operator: getRandomEnumValue(GeoOperators),
        value: [
          [35.02482546066713, 31.9049648768097],
          [35.02482546066713, 31.904387420397512],
          [35.02532145261821, 31.904387420397512],
          [35.02532161961821, 31.9049648768097],
          [35.02482546066713, 31.9049648768097],
        ]
      };
      const response = await requestSender.postPolygon(MockApp, requestBody);

      expect(response.status).toBe(httpStatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toHaveProperty('message', 'DataBase error');
    });  
  });
});

  describe('GET/getProduct/{field}/{operator}/{value}', function () {
    describe('Happy Path 🙂', function () {
      it('should return 204 if there are no matching products', async function () {
        const requestBody = {
          field: 'name',
          operator: '=',
          value: 'Product',
        };
        const response = await requestSender.getProduct(app, requestBody.field, requestBody.operator, requestBody.value);
  
        expect(response.status).toBe(httpStatusCodes.NO_CONTENT);
      });
  
      it('should return 200 status code and products list', async function () {
        const product: Product = createFakeProduct();
  
        const requestBody = {
          field: 'name',
          operator: '=',
          value: 'Product',
        };
  
        const createResponse = await requestSender.createProduct(app, product);
        expect(createResponse.headers).toHaveProperty('content-type', 'application/json;');
        const response = await requestSender.getProduct(app, requestBody.field, requestBody.operator, requestBody.value);
  
        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.headers).toHaveProperty('content-type', 'application/json;');
        expect(response.body).toHaveLength(1);
  
        const { name, description, boundingPolygon, type, ...createResponseWithoutAnyText } = createResponse.body as unknown as Product;
        expect(response.body).toMatchObject([createResponseWithoutAnyText]);
      });
    });
  });
});




