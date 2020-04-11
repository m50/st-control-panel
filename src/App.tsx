import React, {useState, ChangeEvent, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { BodyWrapper } from './components/structure/BodyWrapper';
import { UserDropdown } from './components/structure/UserIcon';
import LoginPage from './components/pages/Login';
import { AuthStatus } from './types';
import config from './configuration.json';
import System from './components/pages/System';
import SpamTitanAPI from './spamtitan/API';
import TextInput from './components/structure/pre-styled/TextInput';
import { ReactComponent as SearchIcon} from './components/zondicons/search.svg'
import { UserRouter } from './components/pages/Users/Router';

export const api = new SpamTitanAPI(config.spamtitanInstances);

export const initAuthStatus: AuthStatus = {
  keys: [],
  loggedIn: false,
  user: {},
}

let logoutTimer: NodeJS.Timeout;

export default () => {
  const [search, setSearch] = useState('');
  const [authStatus, setAuthStatus] = useState(
    JSON.parse(localStorage.getItem('authStatus') ?? JSON.stringify(initAuthStatus))
  );

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

  const authStatusComponents = { authStatus: authStatus, setAuthStatus: setAuth };

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
    <Router>
      <div className="bg-white dark:bg-gray-900">
        <header className="w-screen fixed left-0 top-0 z-50 bg-orange-500 flex items-center justify-between text-white h-14">
          <div className="w-1/2 flex justify-between content-center text-center items-center">
            <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
            <div className={"w-1/2 " + (authStatus.loggedIn ? '' : 'hidden')}>
              <TextInput placeholder="Search"
                value={search}
                onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setSearch(ev.target?.value)}
                icon={SearchIcon}
                className="w-full mb-2" />
            </div>
          </div>
          <UserDropdown {...authStatusComponents} />
        </header>
        <Switch>
          <Route exact path="/login">
            <LoginPage {...authStatusComponents} />
          </Route>
          <Route exact path="/dashboard">
            <BodyWrapper loggedIn={authStatus.loggedIn}>
              Dashboard Route
            </BodyWrapper>
          </Route>
          <Route exact path="/system">
            <BodyWrapper loggedIn={authStatus.loggedIn}>
              <System {...authStatusComponents} />
            </BodyWrapper>
          </Route>
          <Route path="/users">
            <UserRouter {...authStatusComponents} />
          </Route>
          <Route exact path="/">
            <Redirect to={authStatus.loggedIn ? '/dashboard' : '/login'} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
