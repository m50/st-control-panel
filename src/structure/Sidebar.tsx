import React from 'react';
import { NavLink } from "react-router-dom";

interface SidebarProps {
  className: string;
};
interface SidebarState { };

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {
  render() {
    return (
      <nav className={this.props.className}>
        <ul>
          <SidebarLink icon='' to='/dashboard'>Dashboard</SidebarLink>
          <SidebarLink icon='' to='/system'>System</SidebarLink>
          <SidebarLink icon='' to='/domains'>Domains</SidebarLink>
          <SidebarLink icon='' to='/domain-groups'>Domain Groups</SidebarLink>
          <SidebarLink icon='' to='/reporting'>Reporting</SidebarLink>
        </ul>
      </nav>
    );
  }
}

interface SidebarLinkProps {
  to: string;
  icon: string;
  children: string;
};
const SidebarLink: React.FunctionComponent<SidebarLinkProps> = (props) => {
  return (
    <li>
      <NavLink className="
            w-full text-xl flex justify-around content-center align-center text-white py-5
            hover:bg-gray-600 focus:bg-blue-600
          "
        activeClassName="border-l-2 border-orange-400 bg-gray-800" to={props.to}>{props.children}</NavLink>
    </li>
  );
}
