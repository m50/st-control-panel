export interface LinkData {
    to: string,
    icon: string | React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined; }>,
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

export interface AuthStatusProps {
    authStatus: AuthStatus,
    setAuthStatus: CallableFunction,
}
