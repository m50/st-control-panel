
export interface RootObject { }

export interface BodyParameters {
  [key: string]: any,
}

export interface BaseResponseObject<RespType extends RootObject> {
  objectType?: string,
  code: number,
}

export interface DataResponseObject<RespType extends RootObject> extends BaseResponseObject <RespType> {
  object: RespType,
}

export interface ListResponseObject<RespType extends RootObject> extends BaseResponseObject<RespType> {
  data: RespType[],
  count: number,
  total: number,
}

export interface ErrorResponse extends BaseResponseObject<RootObject> {
  error: string | object[],
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
