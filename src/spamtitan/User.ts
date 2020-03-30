import { Role } from "./Role";
import { Policy } from "./Policy";

export interface Alias {

}

export interface User {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    comment: string,
    policy: Policy,
    roles: Role[],
    aliases: false | Alias[]
}
