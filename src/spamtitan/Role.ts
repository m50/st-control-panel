export interface Role {
    id: number,
    name: string,
    type: 'admin'|'realm'|'domain'|'user',
    domain?: string,
    domain_group?: string,
}
