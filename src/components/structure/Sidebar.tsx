import React from 'react';
import { NavLink } from "react-router-dom";
import { LinkData } from "../../types";

interface SidebarProps { };

export default class Sidebar extends React.Component<SidebarProps, {}> {
  linkData: LinkData[]

  constructor(props: SidebarProps) {
    super(props);
    this.linkData = [
      {to: '/dashboard', icon: '', title: 'Dashboard'},
      {to: '/system', icon: '', title: 'System'},
      {to: '/domains', icon: '', title: 'Domains'},
      {to: '/domain-groups', icon: '', title: 'Domain Groups'},
      {to: '/reporting', icon: '', title: 'Reporting'},
      {to: '/quarantine', icon: '', title: 'Quarantine'},
      {to: '/history', icon: '', title: 'History'},
    ];
  }
  render() {
    return (
      <nav className="
        pt-20 w-auto h-full bg-gray-700 inline-block
      ">
        <ul>
          {this.linkData.map((link, index) => <SidebarLink key={index} icon={link.icon} to={link.to}>{link.title}</SidebarLink>)}
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
            w-full text-xl flex justify-left content-center align-center text-white py-5
            hover:bg-gray-600 focus:bg-blue-600 px-5
          "
        activeClassName="border-l-2 border-orange-400 bg-gray-800" to={props.to}
      >
        {props.children}
      </NavLink>
    </li>
  );
}
