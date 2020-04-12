import React, {useState, ChangeEvent, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { BodyWrapper } from './components/structure/BodyWrapper';
import { UserDropdown } from './components/structure/UserIcon';
import LoginPage from './components/pages/Login';
import { AuthStatus } from './types';
import config from './configuration.json';
import System from './components/pages/System';
import TextInput from './components/structure/pre-styled/TextInput';
import { ReactComponent as SearchIcon} from './components/zondicons/search.svg'
import { UserRouter } from './components/pages/Users/Router';
import { initAuthStatus, AuthContext } from './AuthContext';

export default () => {
  const [search, setSearch] = useState('');
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
        <header className="w-screen fixed left-0 top-0 z-50 bg-orange-500 flex items-center justify-between text-white h-14">
          <div className="w-full sm:w-1/2 flex justify-between content-center text-center items-center">
            <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
            <div className={"w-1/2 hidden " + (authStatus.loggedIn ? 'sm:block' : 'hidden')}>
              <TextInput placeholder="Search"
                value={search}
                onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setSearch(ev.target?.value)}
                icon={SearchIcon}
                className="w-full mb-2" />
            </div>
          </div>
          <UserDropdown />
        </header>
        <Router>
          <Switch>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/">
              <Redirect to={authStatus.loggedIn ? '/dashboard' : '/login'} />
            </Route>
            <BodyWrapper>
              <Route exact path="/dashboard">
                Dashboard Route
              </Route>
              <Route exact path="/system">
                <System />
              </Route>
              <Route path="/users">
                <UserRouter />
              </Route>
            </BodyWrapper>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}
