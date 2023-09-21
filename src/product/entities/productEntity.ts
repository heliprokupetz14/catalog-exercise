import { Entity, PrimaryGeneratedColumn, Column, GeoJSON } from 'typeorm';
import { ConsumptionProtocol, ProductType } from '../../common/enums';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ name: 'name', type: 'text' })
  public name!: string;

  @Column({ name: 'description', type: 'text' })
  public description!: string;

  @Column({ name: 'bounding_polygon', type: 'geometry', srid: 4326 })
  public boundingPolygon!: GeoJSON;

  @Column({ name: 'consumption_link', type: 'text' })
  public consumtionLink!: string;

  @Column({ name: 'type', type: 'enum', enum: ProductType })
  public type!: ProductType;

  @Column({ name: 'consumption_protocol', type: 'enum', enum: ConsumptionProtocol })
  public consumptionProtocol!: ConsumptionProtocol;

  @Column({ name: 'resolution_best', type: 'real' })
  public resolutionBest!: number;

  @Column({ name: 'min_zoom', type: 'integer' })
  public minZoom!: number;

  @Column({ name: 'max_zoom', type: 'integer' })
  public maxZoom!: number;
}
