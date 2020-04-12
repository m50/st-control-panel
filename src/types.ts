import { User } from "./spamtitan/User";

export interface LinkData {
    to: string,
    icon: SVG,
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
    user: User | {},
}

export type SVG = React.FC<React.SVGProps<SVGSVGElement> & { title?: string | undefined; }>;
