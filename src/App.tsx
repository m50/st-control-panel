import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Sidebar from './components/structure/Sidebar'
import UserIcon from './components/structure/UserIcon';
import LoginPage from './components/pages/Login';
import { AuthStatus } from './types';
import config from './configuration.json';
import System from './components/pages/System';

export const initAuthStatus: AuthStatus = {
  keys: [],
  loggedIn: false,
  user: {},
}

export default () => {
  const [authStatus, setAuthStatus] = useState(
    JSON.parse(localStorage.getItem('authStatus') ?? JSON.stringify(initAuthStatus))
  );

  const setAuth: CallableFunction = (as: AuthStatus) => {
    setAuthStatus(as);
    localStorage.setItem('authStatus', JSON.stringify(as));
  }

  const authStatusComponents = { authStatus: authStatus, setAuthStatus: setAuth };

  if (authStatus.loggedIn) {
    setTimeout(() => setAuth(initAuthStatus), config.logoutTimer /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */);
  }
  return (
    <Router>
      <header className="w-screen fixed left-0 top-0 z-50 bg-orange-500 flex items-center justify-between text-white h-14">
        <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
        <UserIcon {...authStatusComponents} />
      </header>
      <Switch>
        <Route path="/login">
          <LoginPage {...authStatusComponents} />
        </Route>
        <Route path="/dashboard">
          <BodyWrapper loggedIn={authStatus.loggedIn}>
            Dashboard Route
          </BodyWrapper>
        </Route>
        <Route path="/system">
          <BodyWrapper loggedIn={authStatus.loggedIn}>
            <System {...authStatusComponents} />
          </BodyWrapper>
        </Route>
        <Route path="/">
          <Redirect to={authStatus.loggedIn ? '/dashboard' : '/login'} />
        </Route>
      </Switch>
    </Router>
  );
}

interface BodyWrapperProps {
  children: React.ReactNode,
  loggedIn: boolean
}

const BodyWrapper: React.FunctionComponent<BodyWrapperProps> = (props: BodyWrapperProps) => {
  if (!props.loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <div id="body" className="z-0 fixed top-0 left-0 h-screen w-screen flex">
      <Sidebar />
      <div className="pt-14 w-11/12 h-full w-screen inline-block">
        {props.children}
      </div>
    </div>
  );
}
