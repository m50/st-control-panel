import React from 'react';
import { NavLink } from "react-router-dom";
import { LinkData } from "../../types";
import { ReactComponent as dashboardIcon } from "../zondicons/dashboard.svg";
import { ReactComponent as systemIcon } from "../zondicons/cog.svg";
import { ReactComponent as domainIcon } from "../zondicons/at-symbol.svg";
import { ReactComponent as domainGroupIcon } from "../zondicons/cloud.svg";
import { ReactComponent as reportingIcon } from "../zondicons/news-paper.svg";
import { ReactComponent as quarantineIcon } from "../zondicons/shield.svg";
import { ReactComponent as historyIcon } from "../zondicons/inbox-full.svg";

interface SidebarProps { }
interface SidebarState {
  open: boolean,
  expandButtonText: string,
}

const expandedString = 'Shrink Sidebar';
const shrunkenString = '';

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {
  linkData: LinkData[]  = [
    {to: '/dashboard', icon: dashboardIcon, title: 'Dashboard'},
    {to: '/system', icon: systemIcon, title: 'System'},
    {to: '/domains', icon: domainIcon, title: 'Domains'},
    {to: '/domain-groups', icon: domainGroupIcon, title: 'Domain Groups'},
    {to: '/reporting', icon: reportingIcon, title: 'Reporting'},
    {to: '/quarantine', icon: quarantineIcon, title: 'Quarantine'},
    {to: '/history', icon: historyIcon, title: 'History'},
  ]

  className: string = `
    z-50 h-full bg-gray-700 w-screen flex-col justify-between pt-0
    md:pt-16 lg:z-0 sm:flex
  `

  shrunkenClassName: string = `
    sm:w-12 hidden truncate
  `

  expandedClassName: string = `
    flex sm:w-1/6
  `

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      open: false,
      expandButtonText: shrunkenString,
    };
  }

  expandSidebar = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const open = !this.state.open;
    this.setState({
      expandButtonText: open ? expandedString : shrunkenString,
      open: open
    })
  }

  render() {
    return (
      <nav className={this.className + (this.state.open ? this.expandedClassName : this.shrunkenClassName)}>
        <ul className="w-screen h-screen sm:h-auto sm:w-auto overflow-y-auto overflow-x-hidden scrollbar">
          {this.linkData.map((link, index) => <SidebarLink key={index} icon={link.icon} to={link.to}>{link.title}</SidebarLink>)}
        </ul>
        <button
          className="w-full text-3xl md:text-lg text-white py-2 px-1 border-t border-orange-400 outline-none focus:outline-none hover:bg-gray-800"
          onClick={this.expandSidebar}
        >
          <span className={this.state.open ? 'flex justify-between px-4' : 'flex justify-center'}>
            <span>{this.state.open ? '←' : '→'}</span>
            <span>{this.state.expandButtonText}</span>
          </span>
        </button>
      </nav>
    );
  }
}

interface SidebarLinkProps {
  to: string;
  icon: string | React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string | undefined; }>;
  children: string;
};
const SidebarLink: React.FunctionComponent<SidebarLinkProps> = (props) => {
  return (
    <li>
      <NavLink className="
            w-full text-xl flex justify-left content-center align-center text-white py-5
            hover:bg-gray-600 focus:bg-blue-600
          "
        activeClassName="border-l-2 border-orange-400 bg-gray-800" to={props.to}
      >
        <span className="flex flex-col justify-center mx-3"><props.icon className="w-6 h-6 fill-current" /></span>
        <span className="ml-4">{props.children}</span>
      </NavLink>
    </li>
  );
}
