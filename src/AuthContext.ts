import { createContext } from 'react';
import { AuthStatus } from './types';

export const initAuthStatus: AuthStatus = {
  keys: [],
  loggedIn: false,
  user: {},
}

export const AuthContext = createContext<{ authStatus: AuthStatus, setAuthStatus: CallableFunction }>({
  authStatus: initAuthStatus,
  setAuthStatus: () => { }
});
