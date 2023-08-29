import { Request, Response } from "supertest";
import { ProductController } from '../../../src/product/controllers/productController'
import { getRepository } from "typeorm";
import { Product  } from "../../../src/product/entities/productEntity";
import { ConsumptionProtocol, ProductType } from "../../../src/common/enums";



describe('createProduct', () => {
  it('should create a new product', async() => {
    const mockProductData: Product = {
          name: "another home",
          description: "not my home",
          boundingPolygon: {
            type: "Polygon",
                    "coordinates": [
                  [
                    [
                      35.02482546066713,
                      31.9049648768097
                    ],
                    [
                      35.02482546066713,
                      31.904387420397512
                    ],
                    [
                      35.02532161961821,
                      31.904387420397512
                    ],
                    [
                      35.02532161961821,
                      31.9049648768097
                    ],
                    [
                      35.02482546066713,
                      31.9049648768097
                    ]
                  ]
        ]
          },
          consumtionLink: "https://geojson.io/#map=18.52/31.9038859/35.015387",
          type: ProductType.raster,
          consumptionProtocol: ConsumptionProtocol.WMS,
          resolutionBest: 14,
          minZoom: 6,
          maxZoom: 11
        };

        const request = {
          body: mockProductData,
        } as Request;
    

    const jsonMock = jest.fn();
    const response = { status: jest.fn().mockReturnValue ({ json: jsonMock }) } as unknown as Response;

    const saveMock = jest.fn().mockResolvedValue(mockProductData);
    jest.spyOn(getRepository(Product), 'save').mockReturnValue(saveMock);

    const controller = new ProductController();

    await controller.createProduct(request, response);

    expect(saveMock).toHaveBeenCalledWith(mockProductData);
    expect(response.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(mockProductData)
  }) 

})