// import jsLogger from '@map-colonies/js-logger';
// import { Request, Response } from 'express';
// import { ProductController } from '../../../src/product/controllers/productController';
// import { Product } from '../../../src/product/entities/productEntity';
// import { ConsumptionProtocol, ProductType } from '../../../src/common/enums';
// import { Repository } from 'typeorm';
// import { getApp } from '../../../src/app';
// import { SERVICES } from '../../../src/common/constants';
// import { trace } from '@opentelemetry/api';
// import { container } from 'tsyringe';

// describe('ProductController', () => {
//   let request: Partial<Request>;
//   let response: Partial<Response>;
//   let productController: ProductController;
//   const repositoryMock = {
//     save: jest.fn(),
//   };

//   getApp({
//     override: [
//       { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
//       { token: SERVICES.METADATA_REPOSITORY, provider: { useValue: repositoryMock } },
//     ],
//   });

//   productController = container.resolve(ProductController);

//   beforeEach(() => {
//     request = {
//       body: {
//         id: 1,
//         name: 'another home',
//         description: 'not my home',
//         boundingPolygon: {
//           type: 'Polygon',
//           coordinates: [
//             [
//               [35.02482546066713, 31.9049648768097],
//               [35.02482546066713, 31.904387420397512],
//               [35.02532161961821, 31.904387420397512],
//               [35.02532161961821, 31.9049648768097],
//               [35.02482546066713, 31.9049648768097],
//             ],
//           ],
//         },
//         consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
//         type: ProductType.raster,
//         consumptionProtocol: ConsumptionProtocol.WMS,
//         resolutionBest: 14,
//         minZoom: 6,
//         maxZoom: 11,
//       },
//     };
//     response = {
//       status: function (statusCode: number) {
//         this.statusCode = statusCode;
//         return this;
//       },
//       json: function (data: any) {
//         this.responseData = data;
//         return this;
//       },
//     };
//   });

//   it('should create a new poduct', async () => {
//     await productController.createProduct(request as Request, response as Response);
//     expect(status).toBe(200);
//   });

//   it('should handle errors', async () => {
//     repositoryMock.save = async () => {};
//   });
// });
