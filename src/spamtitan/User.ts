import { Role } from "./Role";
import { Policy } from "./Policy";
import { RootObject } from "./requestTypes";

export interface Alias {

}

export interface User extends RootObject {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    comment: string,
    policy: Policy,
    roles: Role[],
    aliases: false | Alias[]
}
