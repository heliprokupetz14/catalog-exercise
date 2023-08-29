export enum ConsumptionProtocol {
  WMS = 'WMS',
  WMTC = 'WMTC',
  XYZ = 'XYZ',
  Tiles3D = '3D Tiles',
}

export enum Operators {
  Greater = '>',
  GreaterEqual = '>=',
  Less = '<',
  LessEqual = '<=',
  Equal = '=',
}

export enum ProductType {
  raster = 'raster',
  rasterizedvector = ' rasterized vector',
  tile3d = '3d tiles',
  QMesh = 'QMesh',
}

export enum GeoOperators {
  contains = 'contains',
  within = 'within',
  intersects = 'intersects'
}