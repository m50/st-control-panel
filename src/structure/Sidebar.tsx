import React from 'react';
import { Link } from "react-router-dom";

interface SidebarProps {
  className: string;
};
interface SidebarState { };

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {
  render() {
    return (
      <nav className={this.props.className}>
        <ul>
          <SidebarLink icon='' to='/'>Home</SidebarLink>
          <SidebarLink icon='' to='/dashboard'>Dashboard</SidebarLink>
        </ul>
      </nav>
    );
  }
}

interface SidebarLinkProps {
  to: string;
  icon: string;
};

interface SidebarLinkState {};

class SidebarLink extends React.Component<SidebarLinkProps, SidebarLinkState> {
  render() {
    return (
      <li className="
        w-full text-xl flex justify-around content-center align-center text-white py-5
        hover:bg-gray-600 focus:bg-blue-600
      ">
        <Link to={this.props.to}>{this.props.children}</Link>
      </li>
    )
  }
}
