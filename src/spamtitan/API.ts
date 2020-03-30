import { AuthKey } from "../types";
import { User } from "./User";
import { Token } from "./Token";
import { BodyParameters, BaseResponseObject, RequestMethod, DataResponseObject, ListResponseObject, ErrorResponse, RootObject } from "./requestTypes";

export default class SpamTitanAPI {
  private authKeys: AuthKey[] = [];
  private servers: string[] = [];

  constructor(authKeys: AuthKey[], servers: string[]) {
    this.authKeys = authKeys;
    this.servers = servers;
  }

  auth = async (email: string, password: string): Promise<User | false> => {
    this.servers.forEach(async (server: string) => {
      server = server.replace(/\/$/, '');
      const response: BaseResponseObject<Token> = await this.makeRequest<Token>('POST', `${server}/restapi/auth/tokens`, {
        email: email,
        password: password,
        validation_errors: true,
      });

      if (responseIsDataObject(response) && response.code === 201) {
        this.authKeys.push({
          spamtitan: server,
          key: response.object.access_token,
          keyId: response.object.id,
        });
      }
    });

    if (this.authKeys.length !== this.servers.length) {
      this.logout();

      return false;
    }

    const userResponse: BaseResponseObject<User> = await this.query<User>('GET', `/users/${email}`);

    if (responseIsDataObject(userResponse)) {
      return userResponse.object;
    }

    this.logout();

    return false;
  }

  logout = (): boolean => {
    let success = true;
    this.authKeys.forEach(async (authKey: AuthKey) => {
      const response = await this.makeRequest('DELETE', `${authKey.spamtitan}/restapi/auth/tokens/${authKey.keyId}`);
      if (response.code === 200) {
        this.authKeys = this.authKeys.filter((key: AuthKey): boolean => authKey.key === key.key && authKey.spamtitan === key.spamtitan );
      } else {
        success = false;
      }
    });

    return success;
  }

  query = async <RespType>(
    method: RequestMethod,
    endPoint: string,
    body?: BodyParameters
  ): Promise<BaseResponseObject<RespType>> => {
    const authKey: AuthKey = this.authKeys[Math.random() * this.authKeys.length];
    body = body ?? {};

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Beader ${authKey.key}`,
    };

    body.validation_errors = true;

    return this.makeRequest(method, `${authKey.spamtitan}/restapi/${endPoint}`, body, headers);
  }

  private makeRequest = async <RespType>(
    method: RequestMethod,
    url: string, body?: BodyParameters,
    headers?: Record<string, string>
  ): Promise<BaseResponseObject<RespType>> => {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(body ?? {}),
      headers: headers ?? {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    const { object, code, ...rest } = json;

    if (object === 'list') {
      const { count, total, data } = rest;
      const responseObject: ListResponseObject<RespType> = {
        objectType: object,
        code: code,
        total: total,
        count: count,
        data: data
      }

      return responseObject;
    }

    if (object) {
      const responseObject: DataResponseObject<RespType> = {
        objectType: object,
        code: code,
        object: rest,
      };

      return responseObject;
    }

    const { error } = rest;
    const responseObject: ErrorResponse = {
      code: code,
      error: error,
    };

    return responseObject;
  }
}

export function responseIsList<T>(response: BaseResponseObject<T>): response is ListResponseObject<T> {
  return response?.objectType === 'list';
}

export function responseIsDataObject<T>(response: BaseResponseObject<T>): response is DataResponseObject<T> {
  return (response as DataResponseObject<T>).object !== undefined;
}

export function responseIsError(response: BaseResponseObject<RootObject>): response is ErrorResponse {
  return (response as ErrorResponse).error !== undefined;
}
