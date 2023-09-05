// import jsLogger from '@map-colonies/js-logger';
// import { Request, Response } from 'express';
// import { ConsumptionProtocol, ProductType } from '../../../src/common/enums';
// import { getApp } from '../../../src/app';
// import { SERVICES } from '../../../src/common/constants';
// import { container } from 'tsyringe';
// import { ProductManager } from '../../../src/product/models/productManager';
// import { Product } from '../../../src/product/entities/productEntity';
// import {validProduct} from '../../mocks/productMock'

//   describe('ProductController', () => {
//     let productManager: ProductManager;
//     const repositoryMock = {
//       save: jest.fn(),
//     };

//     getApp({
//       override: [
//         { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
//         { token: SERVICES.METADATA_REPOSITORY, provider: { useValue: repositoryMock } },
//       ],
//     });

//     productManager = container.resolve(ProductManager);

//     describe('ProductManager', () => {
//       beforeEach(function () {
//         productManager = new productManager(jsLogger({ enabled: false }));
//       })
//       describe('createProduct', () => {
//         it('Should create a new product', async () => {
//           const productMockData: Product = {
//           id: 1,
//           name: 'another home',
//           description: 'not my home',
//           boundingPolygon: {
//             type: 'Polygon',
//             coordinates: [
//               [
//                 [35.02482546066713, 31.9049648768097],
//                 [35.02482546066713, 31.904387420397512],
//                 [35.02532161961821, 31.904387420397512],
//                 [35.02532161961821, 31.9049648768097],
//                 [35.02482546066713, 31.9049648768097],
//               ],
//             ],
//           },
//           consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
//           type: ProductType.raster,
//           consumptionProtocol: ConsumptionProtocol.WMS,
//           resolutionBest: 14,
//           minZoom: 6,
//           maxZoom: 11,
//         }

//           const createdProduct: Product = {
//             id: 1,
//             name: 'another home',
//             description: 'not my home',
//             boundingPolygon: {
//               type: 'Polygon',
//               coordinates: [
//                 [
//                   [
//                     35.02482546066713,
//                     31.9049648768097,
//                   ],
//                   [
//                     35.02482546066713,
//                     31.904387420397512,
//                   ],
//                   [
//                     35.02532161961821,
//                     31.904387420397512,
//                   ],
//                   [
//                     35.02532161961821,
//                     31.9049648768097,
//                   ],
//                   [
//                     35.02482546066713,
//                     31.9049648768097,
//                   ],
//                 ],
//               ],
//             },
//           consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
//           type: ProductType.raster,
//           consumptionProtocol: ConsumptionProtocol.WMS,
//           resolutionBest: 14,
//           minZoom: 6,
//           maxZoom: 11,
//         };

//         repositoryMock.save.mockResolvedValue(validProduct);
//         const result = await productManager.createProduct(productMockData);


//         expect(result).toEqual(validProduct); 
//         expect(repositoryMock.save).toHaveBeenCalledWith(productMockData);
//       });

//       it('Should throw an error if saving fails', async => {
//         const productData: Product = {
//           id: 1,
//           name: 'another home',
//           description: 'not my home',
//           boundingPolygon: {
//             type: 'Polygon',
//             coordinates: [
//               [
//                 [35.02482546066713, 31.9049648768097],
//                 [35.02482546066713, 31.904387420397512],
//                 [35.02532161961821, 31.904387420397512],
//                 [35.02532161961821, 31.9049648768097],
//                 [35.02482546066713, 31.9049648768097],
//               ],
//             ],
//           },
//           consumtionLink: 'https://geojson.io/#map=18.52/31.9038859/35.015387',
//           type: ProductType.raster,
//           consumptionProtocol: ConsumptionProtocol.WMS,
//           resolutionBest: 14,
//           minZoom: 6,
//           maxZoom: 11,
//         };

//         const errorMessage = 'Failed to save product';
//         repositoryMock.save.mockRejectedValue(new Error(errorMessage));

//         expect(productManager.createProduct(productData)).rejects.toThrow(errorMessage);
//         expect(repositoryMock.save).toHaveBeenCalledWith(productData);
//       });
//     });
//   })
// })
