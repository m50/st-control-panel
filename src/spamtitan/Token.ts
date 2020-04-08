import { RootObject } from "./requestTypes";

export interface Token extends RootObject {
  token_id: string,
  access_token: string,
  token_name: string,
  created_at: string,
  expires_at: string,
  user_id: number,
}
