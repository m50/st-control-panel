import React, {useState, useEffect, useContext} from 'react';
import { AuthStatus } from './types';
import config from './configuration.json';
import { initAuthStatus, AuthContext } from './AuthContext';
import { Header } from './components/structure/Header';
import { AppRouter } from './AppRouter';

export default () => {
  const [authStatus, setAuthStatus] = useState(
    JSON.parse(localStorage.getItem('authStatus') ?? JSON.stringify(initAuthStatus))
  );
  const { api } = useContext(AuthContext);
  let logoutTimer: NodeJS.Timeout;

  useEffect(() => {
    localStorage.setItem('authStatus', JSON.stringify(authStatus));
  }, [authStatus]);

  const setAuth: CallableFunction = (as: AuthStatus) => {
    if (!as.loggedIn) {
      api.logout().then(() => {
        setAuthStatus(as);
      });
    } else {
      setAuthStatus(as);
    }
  }

  const authContext = {
    authStatus,
    setAuthStatus: setAuth,
    api
  };

  const setLogoutTimer = () => {
    logoutTimer = setTimeout(
      () => setAuth(initAuthStatus),
      config.logoutTimer /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */
    )
  };

  if (authStatus.loggedIn) {
    setLogoutTimer();
  }
  window.addEventListener('mouseup', () => {
    clearTimeout(logoutTimer);
    setLogoutTimer();
  });
  return (
    <div className="bg-white dark:bg-gray-900">
      <AuthContext.Provider value={authContext}>
        <Header />
        <AppRouter />
      </AuthContext.Provider>
    </div>
  );
}
