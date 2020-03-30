export interface LinkData {
    to: string,
    icon: string,
    title: string,
}

export interface AuthKey {
    spamtitan: string,
    key: string,
    keyId: string,
}

export interface AuthStatus {
    loggedIn: boolean,
    keys: AuthKey[],
    user: object,
}
