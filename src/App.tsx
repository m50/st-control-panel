import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from './structure/Sidebar'
import UserIcon from './structure/UserIcon';

function App() {
  return (
    <Router>
      <header className="bg-orange-400 flex items-center justify-between text-white">
        <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
        <UserIcon />
      </header>
      <div id="body" className="h-screen w-screen">
        <Sidebar className="w-1/6 h-full bg-gray-800 inline-block" />
        <div className="w-5/6 h-full inline-block">
          <Switch>
            <Route path="/">
              Default Route
            </Route>
            <Route path="/dashboard">
              Dashboard Route
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
