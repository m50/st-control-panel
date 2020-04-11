import { AuthKey } from "../types";
import { User } from "./User";
import { Token } from "./Token";
import { BodyParameters, BaseResponseObject, RequestMethod, DataResponseObject, ListResponseObject, ErrorResponse, RootObject } from "./types";
import { isNull } from "util";

export default class SpamTitanAPI {
  private authKeys: AuthKey[] = [];
  private servers: string[] = [];

  constructor(servers: string[]) {
    const authStatus = JSON.parse(localStorage.getItem('authStatus') ?? '{}');
    if (authStatus.keys) {
      this.authKeys = authStatus.keys;
    }

    this.servers = servers;
  }

  getKeys = (): AuthKey[] => {
    return this.authKeys;
  }

  auth = async (email: string, password: string): Promise<User> => {
    this.authKeys = [];
    const responses = await Promise.all(this.servers.map((server: string) => {
        server = server.replace(/\/$/, '');
        return this.makeRequest<Token>('POST', `${server}/restapi/auth/tokens`, {
          username: email,
          password: password,
          validation_errors: true,
          expires: true,
          expiration_date: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/),
        }).then((response) => {
          return {
            spamtitan: server,
            response: response,
          }
        });
      }));

    let userId: number = 0;

    responses.forEach((data: {spamtitan: string, response: BaseResponseObject<Token>}) => {
      if (responseIsDataObject(data.response) && data.response.code === 201) {
        this.authKeys.push({
          spamtitan: data.spamtitan,
          key: (data.response as DataResponseObject<Token>).object.access_token,
          keyId: (data.response as DataResponseObject<Token>).object.token_id,
        });
        userId = (data.response as DataResponseObject<Token>).object.user_id;
      } else {
        throw data.response;
      }
    })

    if (this.authKeys.length !== this.servers.length) {
      this.logout();

      const newError: ErrorResponse = {
        error: 'Unable to log into all machines in cluster.',
        code: 500,
      }
      throw newError;
    }

    const userResponse: BaseResponseObject<User> = await this.query<User>('GET', `/users/${userId}`);

    if (responseIsDataObject(userResponse)) {
      return userResponse.object;
    }

    if (responseIsError(userResponse)) {
      throw userResponse
    }

    const newError: ErrorResponse = {
      error: `An unknown error has occured. (${userResponse.code})`,
      code: userResponse.code,
    }
    throw newError;
  }

  logout = async (): Promise<boolean> => {
    let success = true;
    const responses = await Promise.all(this.authKeys.map((authKey: AuthKey): null | Promise<{response: BaseResponseObject<RootObject>, authKey: AuthKey}> => {
      if (authKey) {
        return this.query<RootObject>('DELETE', `auth/tokens/${authKey.keyId}`, {}, authKey)
          .then((response) => { return { response: response, authKey: authKey }; });
      }

      return null;
    }));

    responses.forEach((data: { response: BaseResponseObject<RootObject>, authKey: AuthKey } | null) => {
      if (isNull(data)) {
        return;
      }
      if (data.response.code === 200) {
        this.authKeys = this.authKeys.filter((key: AuthKey): boolean => data.authKey.key === key.key && data.authKey.spamtitan === key.spamtitan);
      } else {
        success = false;
      }
    })

    return success;
  }

  query = async <RespObject extends RootObject>(
    method: RequestMethod,
    endPoint: string,
    body?: BodyParameters,
    specifiedKey?: AuthKey,
  ): Promise<BaseResponseObject<RespObject>> => {
    if (this.authKeys.length < 1) {
      throw new Error('There are no auth keys.');
    }
    const authKey: AuthKey = specifiedKey ?? this.authKeys[Math.floor(Math.random() * this.authKeys.length)];
    body = body ?? {};

    if (!authKey) {
      throw new Error('Key cannot be found.');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${authKey.key}`,
    };

    body.validation_errors = true;

    return this.makeRequest<RespObject>(method, `${authKey.spamtitan}/restapi/${endPoint.replace(/^\/|\/$/g, '')}`, body, headers);
  }

  private makeRequest = async <RespObject extends RootObject>(
    method: RequestMethod,
    url: string,
    body?: BodyParameters,
    headers?: Record<string, string>
  ): Promise<BaseResponseObject<RespObject>> => {
    let h = headers ?? {};
    h['Content-Type'] = 'application/json';
    h['Accept'] = 'application/json';
    let config: RequestInit = {
      method: method,
      headers: h,
    };
    if (method !== 'GET') {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(url, config)
      .then((resp) => resp.json());

    const { object, code, ...rest } = response;

    if (object === 'list') {
      const { count, total, data } = rest;
      const responseObject: ListResponseObject<RespObject> = {
        objectType: object,
        code: code,
        total: total,
        count: count,
        data: data
      }

      return responseObject;
    }

    if (object) {
      const responseObject: DataResponseObject<RespObject> = {
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

    if (responseObject.code === 401) {
      localStorage.removeItem('authStatus');
    }

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
