import React from 'react';
import { Route } from 'react-router';
import { Dashboard } from './components/pages/Dashboard';
import System from './components/pages/System';
import { UserRouter } from './components/pages/Users/Router';

export const AppRouter: React.FC = () => {
  return (
    <>
      <Route exact path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact path="/system">
        <System />
      </Route>
      <Route path="/users">
        <UserRouter />
      </Route>
    </>
  );
}
