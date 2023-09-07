import * as supertest from 'supertest';
import { Application } from 'express';
import { container } from 'tsyringe';
import { ServerBuilder } from '../../src/serverBuilder';
import { SERVICES } from '../../src/common/constants';
import { Product } from '../../src/product/entities/productEntity';

export function getApp(): Application {
  const builder = container.resolve<ServerBuilder>(ServerBuilder);
  return builder.build();
};

export function getMockRepoApp(repo: unknown): Application {
  container.register(SERVICES.METADATA_REPOSITORY, {useValue: repo});
  return getApp();
};

export async function createProduct(app: Application, product:Product): Promise<supertest.Response> {
  return supertest.agent(app).post('/product/createProduct').set('Content-Type', 'application/json').send(product);
};

export async function getById(app: Application, ID: number): Promise<supertest.Response> {
  return supertest.agent(app).get(`/product/getById/${ID}`).set('Content-Type', 'application/json');
}
export async function getAllProducts(app: Application): Promise<supertest.Response> {
  return supertest.agent(app).get('/product/allProducts').set('Content-Type','application/json');
};

export async function updatedProduct(app: Application, id: number, product: Product): Promise<supertest.Response> {
  return supertest.agent(app).put(`/product/updateProduct/${id}`).set('Content-Type','application/json').send(product);
};

export async function deleteProduct(app: Application, id: number): Promise<supertest.Response> {
  return supertest.agent(app).delete(`/product/deleteProduct/${id}`).set('Content-Type','application/json');
};

export async function postPolygon(app: Application, body: any): Promise<supertest.Response> {
  return supertest.agent(app).post(`/product/postPolygon`).send(body);
};

export async function getProduct(app: Application, field: string, operator: string, value: string | number): Promise<supertest.Response> {
  return supertest.agent(app).get(`/product/getProduct/${field}/${operator}/${value}`).set('Content-Type','application/json');
};




