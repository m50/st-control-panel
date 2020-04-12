import React, { useContext } from 'react';
import { Dashboard } from './components/pages/Dashboard';
import System from './components/pages/System';
import { UserRouter } from './components/pages/Users/Router';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { BodyWrapper } from './components/structure/BodyWrapper';
import LoginPage from './components/pages/Login';
import { AuthContext } from './AuthContext';

export const AppRouter: React.FC = () => {
  const { authStatus } = useContext(AuthContext);
  return (
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
            <Dashboard />
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
  );
}
