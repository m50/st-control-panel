import { RootObject } from "./requestTypes";

export interface Token extends RootObject {
  id: string,
  access_token: string,
  token_name: string,
  created_at: string,
  expires_at: string,
}
