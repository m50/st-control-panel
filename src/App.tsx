import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Sidebar from './structure/Sidebar'
import UserIcon from './structure/UserIcon';

export default () => {
  return (
    <Router>
      <header className="w-screen fixed left-0 top-0 z-50 bg-orange-400 flex items-center justify-between text-white">
        <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
        <UserIcon />
      </header>
      <Switch>
        <Route path="/dashboard">
          <BodyWrapper>
            Dashboard Route
          </BodyWrapper>
        </Route>
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Router>
  );
}

const BodyWrapper: React.FunctionComponent<{ children: string | JSX.Element | JSX.IntrinsicElements }> = (props) => {
  return (
    <div id="body" className="z-0 fixed top-0 left-0 h-screen w-screen flex">
      <Sidebar className="pt-20 w-1/6 h-full bg-gray-700 inline-block" />
      <div className="pt-20 w-5/6 h-full inline-block">
        {props.children}
      </div>
    </div>
  );
}
