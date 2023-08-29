import { Entity, PrimaryGeneratedColumn, Column, GeoJSON, Polygon } from "typeorm";
import { ConsumptionProtocol, ProductType } from "../../common/enums";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'text'})
    name!: string;

    @Column({name: 'description', type: 'text'})
    description!: string;

    @Column({ name: 'bounding_polygon', type: 'geometry',  srid: 4326 })
    boundingPolygon!: GeoJSON; 

    @Column({name: 'consumption_link', type: 'text'})
    consumtionLink!: string;

    @Column({ name: 'type', type: 'enum', enum: ProductType })
    type!: ProductType;

    @Column({ name: 'consumption_protocol', type: 'enum', enum: ConsumptionProtocol })
    consumptionProtocol!: ConsumptionProtocol;

    @Column({name: 'resolution_best', type: 'float'})
    resolutionBest!: number;

    @Column({name: 'min_zoom', type: 'integer'})
    minZoom!: number;

    @Column({name: 'max_zoom', type: 'integer'})
    maxZoom!: number;
}


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async ingestData(data: Product[]): Promise<Product[]> {
    const savedProducts = await this.productRepository.save(data);
    return savedProducts;
  }
}
