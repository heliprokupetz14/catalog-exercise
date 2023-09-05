import { ConsumptionProtocol, ProductType } from "../../src/common/enums";

export const validProduct = {
    id:1,
    name: 'Test Product',
        description: 'Test description',
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
