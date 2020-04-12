import { createContext } from 'react';
import { AuthStatus } from './types';
import SpamTitanAPI from './spamtitan/API';
import config from './configuration.json';

export const initAuthStatus: AuthStatus = {
  keys: [],
  loggedIn: false,
  user: {},
}

interface Context {
  authStatus: AuthStatus,
  setAuthStatus: CallableFunction,
  api: SpamTitanAPI
}

export const AuthContext = createContext<Context>({
  authStatus: initAuthStatus,
  setAuthStatus: (() => { }),
  api: new SpamTitanAPI(config.spamtitanInstances),
});
