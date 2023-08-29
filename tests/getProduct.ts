import axios from "axios";
import nock from "nock";
import sinon from "sinon";
import { expect } from "chai";
import { before } from "node:test";

let axiosAPIClient: any;
// type CreateProductResponse = {
// 	name: string;
// 	description: string;
// 	boundingPolygon: any;
// 	consumptionLink: string;
// 	type: string;
// 	consumptionProtocol: string;
// 	resolutionBest: number;
// 	minZoom: number;
// 	maxZoom: number;
//   };

before(async () => {
	const apiConnection: any = await initializeWebServer();
	const axiosConfig = {
		baseURL: `http://127.0.0.1:${apiConnection.port}`,
		headers: {
			"Content-type": "application/json",
		},
		validateStatus: () => true,
	};
	const hostname = "127.0.0.1";
	axiosAPIClient = axios.create(axiosConfig);
	// console.log("--------------------------");
	// console.log(axiosAPIClient.defaults.baseURL);
	// console.log("--------------------------");
	nock.disableNetConnect();
	nock.enableNetConnect(hostname);
});

beforeEach(() => {
	nock.cleanAll();
	sinon.restore();

	nock("http://localhost/products")
		.get(`/1`)
		.reply(200, {
			id: 1,
			name: "Product 1",
			description: "Description of Product 1",
			boundingPolygon: {
				type: "Polygon",
				coordinates: [
					[
						[-74.005941, 40.712784],
						[-73.972372, 40.712784],
						[-73.972372, 40.726006],
						[-74.005941, 40.726006],
						[-74.005941, 40.712784],
					],
				],
			},
			consumptionLink: "http://example.com/product1",
			type: "raster",
			consumptionProtocol: "WMS",
			resolutionBest: 0,
			minZoom: 10,
			maxZoom: 18,
		});
});

after(async () => {
	nock.enableNetConnect();
	stopWebServer();
});

// describe("Get all book list", async () => {
// 	it("Get books", async () => {
// 		const response = await axios.get(`${axiosAPIClient.defaults.baseURL}/products/1`, {
// 		});
// 		console.log(response.data);
// 		expect(response.status).equals(200); //asserting if the response code is 200
// 	});
// });

describe("/api", () => {
	describe("GET /products", () => {
		it("When asked for an existing order, Then should retrieve it and receive 200 response", async () => {
			// Arrange
			const productToAdd = {
				name: "Product test",
				description: "Description of Product test",
				boundingPolygon: {
					type: "Polygon",
					coordinates: [
						[
							[-73.9978981, 40.7151919],
							[-73.9870834, 40.7157774],
							[-73.9876413, 40.7199409],
							[-73.9951944, 40.7203637],
							[-73.9978981, 40.7151919],
						],
					],
				},
				consumptionLink: "http://example.com/product-test",
				type: "raster",
				consumptionProtocol: "WMTS",
				resolutionBest: 1,
				minZoom: 3,
				maxZoom: 12,
			};
			// console.log(`${axiosAPIClient.defaults.baseURL}/products`);

			// // const addedProductId = await axiosAPIClient.post(
			// // 	`/products`,
			// // 	productToAdd
			// // ).then((addedProductId: any) => addedProductId)
			// axiosAPIClient.data = productToAdd;
			// axiosAPIClient.url = "/products";
			// // const addedProductId = await axios.post(`${axiosAPIClient.defaults.baseURL}/products`, productToAdd)
			// const addedProductId = await axiosAPIClient.post('/products', productToAdd)

			// console.log(addedProductId.status)
			console.log("8888888888888888888888888888888888888888888888888")
			axios
				.post(`${axiosAPIClient.defaults.baseURL}/products`, productToAdd)
				.then(
					(response) => {
						console.log(response);
					},
					(error) => {
						console.log(error);
					}
				);

			// const options = {
			// 	method: "POST",
			// 	url: `${axiosAPIClient.defaults.baseURL}/products`,
			// 	headers: {
			// 		accept: "application/json",
			// 		"Content-Type": "application/json",
			// 		"X-API-Key": "test",
			// 	},
			// 	data: productToAdd,
			// 	// validateStatus: () => true,
			// };

			// const {
			// 	data: { id: addedProductId },
			// } = await axios
			// 	.request(options)
			// 	.then(function (response) {
			// 		return response;
			// 		// addedProductId = response.data.message
			// 		// console.log(response.status);

			// 		// console.log(response.data);
			// 	})
			// 	.catch(function (error) {
			// 		console.error(error);
			// 	});
			// console.log(addedProductId);
			// console.log(addedProductId)
			// const addedProductId = axiosAPIClient
			// 	.post()
			// 	.then(function ({ data }: { data: Response }) {
			// 		console.log(data);
			// 	})

			// 	.catch(function (error: any) {
			// 		console.error(error);
			// 	});

			// console.log(axiosAPIClient);
			// console.log("--------------------------------------------");
			// console.log(addedProductId);
			// .catch(function (error: { response: { data: any; status: any; headers: any; }; request: any; message: any; config: any; }) {
			// 	if (error.response) {
			// 	  // The request was made and the server responded with a status code
			// 	  // that falls out of the range of 2xx
			// 	  console.log(error.response.data);
			// 	  console.log(error.response.status);
			// 	  console.log(error.response.headers);
			// 	} else if (error.request) {
			// 	  // The request was made but no response was received
			// 	  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// 	  // http.ClientRequest in node.js
			// 	  console.log(error.request);
			// 	} else {
			// 	  // Something happened in setting up the request that triggered an Error
			// 	  console.log('Error', error.message);
			// 	}
			// 	console.log(error.config);
			//   });

			// const addedProductId = addedProduct.config.data

			// ).data.id;
			// console.log("hiiiiiiiiiii");
			// console.log(JSON.parse(addedProductId.config.data));
			// console.log(addedProductId.data);

			// const getResponse = await axiosAPIClient.get(`/products`);

			// Assert
			// expect(getResponse).to.eql({
			// 	status: 200,
			// 	data: {
			// 		productToAdd,
			// 	},
			// });
		});

		// it("When asked for an non-existing product, Then should receive 404 response", async () => {
		// 	// Arrange
		// 	const nonExistingOrderId = -1;

		// 	// Act
		// 	const getResponse = await axiosAPIClient.get(
		// 		`/products/${nonExistingOrderId}`
		// 	);

		// 	// Assert
		// 	expect(getResponse.status).to.eql(404);
		// });
	});
});

export {};

// run example: PORT=3000 npm test
