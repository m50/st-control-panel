import React from 'react';
import { Link } from "react-router-dom";

export default class Sidebar extends React.Component {
  render() {
    return (
      <nav className="w-1/6 h-screen bg-gray-800">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    );
  }
}
