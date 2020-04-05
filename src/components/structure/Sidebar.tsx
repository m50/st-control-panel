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
    h-full bg-gray-700 w-screen flex-col justify-between pt-0 fixed left-0 top-0 pt-14
    transform transition-transform duration-300 ease-in-out
    sm:z-0 flex md:translate-x-0
  `

  shrunkenClassName: string = `
    sm:w-12 -translate-x-full truncate
  `

  expandedClassName: string = `
    translate-x-0 sm:w-1/2 md:w-1/3 xl:w-1/6
  `

  constructor(props: SidebarProps) {
    super(props);
    this.state = JSON.parse(localStorage.getItem('sidebar-status') ?? JSON.stringify({
      open: false,
      expandButtonText: shrunkenString,
    }));
  }

  expandSidebar = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const open = !this.state.open;
    const state = {
      expandButtonText: open ? expandedString : shrunkenString,
      open: open
    };
    this.setState(state);
    localStorage.setItem('sidebar-status', JSON.stringify(state));
  }

  button = (props: {className: string}): JSX.Element => (
    <button
      className={`
        fixed left-0 bottom-0 py-2 px-1 w-12
        text-3xl md:text-white border-orange-400 outline-none bg-transparent truncate overflow-x-hidden text-orange-400 font-bold
        sm:relative sm:bottom-auto sm:left-auto sm:text-lg md:text-lg sm:w-full sm:border-t sm:font-medium
        focus:outline-none focus:text-blue-600 sm:hover:bg-gray-800
      ` + props.className}
      onClick={this.expandSidebar}
    >
      <span className={this.state.open ? 'flex justify-between px-4' : 'flex justify-center'}>
        <span>{this.state.open ? '←' : '→'}</span>
        <span className="ml-2">{this.state.expandButtonText}</span>
      </span>
    </button>
  )

  render() {
    return (
      <>
        <nav className={this.className + (this.state.open ? this.expandedClassName : this.shrunkenClassName)}>
          <ul className="w-screen h-screen sm:h-auto sm:w-auto overflow-y-auto overflow-x-hidden mb-16 md:mb-0">
            {this.linkData.map((link, index) => <SidebarLink key={index} icon={link.icon} to={link.to}>{link.title}</SidebarLink>)}
          </ul>
          <this.button className="hidden sm:block" />
        </nav>
        <this.button className="sm:hidden block z-50" />
      </>
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
        <span className="ml-1 font-thin">{props.children}</span>
      </NavLink>
    </li>
  );
}
