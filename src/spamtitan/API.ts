import { AuthKey } from "../types";
import { User } from "./User";

export interface ResponseObject<RespType> {
  objectType: string,
  code: number,
  object: RespType,
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default class SpamTitanAPI {
  private authKeys: AuthKey[] = [];
  private servers: string[] = [];

  constructor(authKeys: AuthKey[], servers: string[]) {
    this.authKeys = authKeys;
    this.servers = servers;
  }

  auth = (email: string, password: string): User | false => {
    this.servers.forEach(async (server: string) => {
      server = server.replace(/\/$/, '');
      const response = await this.makeRequest('POST', `${server}/restapi/auth/tokens`, { email: email, password: password });
      if (response.code === 201) {
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

    this.query('GET', `/users/${email}`)

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

  query = async <RespType>(method: RequestMethod, endPoint: string, body?: object): Promise<ResponseObject<RespType>> => {
    const authKey: AuthKey = this.authKeys[Math.random() * this.authKeys.length];

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Beader ${authKey.key}`,
    };

    return this.makeRequest(method, `${authKey.spamtitan}/restapi/${endPoint}`, body, headers);
  }

  private makeRequest = async <RespType>(method: RequestMethod, url: string, body?: object, headers?: Record<string, string>): Promise<ResponseObject<RespType>> => {
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
    const responseObject: ResponseObject<RespType> = {
      objectType: object,
      code: code,
      object: rest,
    };

    return responseObject;
  }
}
