import React, { useState, useCallback, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { LinkData, SVG } from "../../types";
import { ReactComponent as dashboardIcon } from "../zondicons/dashboard.svg";
import { ReactComponent as systemIcon } from "../zondicons/cog.svg";
import { ReactComponent as domainIcon } from "../zondicons/at-symbol.svg";
import { ReactComponent as domainGroupIcon } from "../zondicons/cloud.svg";
import { ReactComponent as reportingIcon } from "../zondicons/news-paper.svg";
import { ReactComponent as quarantineIcon } from "../zondicons/shield.svg";
import { ReactComponent as historyIcon } from "../zondicons/inbox-full.svg";
import { ReactComponent as userIcon } from "../zondicons/user.svg";

const expandedString = 'Shrink Sidebar';
const shrunkenString = '';

const linkData: LinkData[] = [
  { to: '/dashboard', icon: dashboardIcon, title: 'Dashboard' },
  { to: '/system', icon: systemIcon, title: 'System' },
  { to: '/domains', icon: domainIcon, title: 'Domains' },
  { to: '/users', icon: userIcon, title: 'Users' },
  { to: '/domain-groups', icon: domainGroupIcon, title: 'Domain Groups' },
  { to: '/reporting', icon: reportingIcon, title: 'Reporting' },
  { to: '/quarantine', icon: quarantineIcon, title: 'Quarantine' },
  { to: '/history', icon: historyIcon, title: 'History' },
];

const className: string = `
  h-full bg-gray-700 w-screen flex-col justify-between pt-0 fixed left-0 top-0 pt-14 z-20
  transform transition-transform duration-300 ease-in-out
  sm:z-0 flex md:translate-x-0
`;

const shrunkenWidth: string = "sm:w-12";
const expandedWidth: string = "sm:w-1/2 md:w-1/3 xl:w-1/6";
const shrunkenClassName: string = `-translate-x-full truncate ${shrunkenWidth}`;
const expandedClassName: string = `translate-x-0 ${expandedWidth}`;


export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [expandButtonText, setExpandButtonText] = useState('');

  useEffect(() => {
    const sidebarStatus = JSON.parse(localStorage.getItem('sidebar-status') ?? JSON.stringify({
      open: false,
      expandButtonText: shrunkenString,
    }));
    setOpen(sidebarStatus.open);
    setExpandButtonText(sidebarStatus.expandButtonText);
  }, []);

  useEffect(() => localStorage.setItem('sidebar-status', JSON.stringify({ open, expandButtonText })), [open, expandButtonText]);

  const expandSidebar = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(o => !o);
    setExpandButtonText(e => e === shrunkenString ? expandedString : shrunkenString);
  }, []);

  const ExpanderButton = useCallback((props: { className: string }): JSX.Element => (
    <button
      className={`
        fixed left-0 bottom-0 py-2 px-1 w-12
        text-3xl md:text-white border-gray-400 outline-none bg-transparent truncate overflow-x-hidden text-orange-400 font-bold
        sm:relative sm:bottom-auto sm:left-auto sm:text-lg md:text-lg sm:w-full sm:border-t sm:font-medium
        focus:outline-none focus:text-blue-600 sm:hover:bg-gray-800
      ` + props.className}
      onClick={expandSidebar}
    >
      <span className={open ? 'flex justify-between px-4' : 'flex justify-center'}>
        <span>{open ? '←' : '→'}</span>
        <span className="ml-2">{expandButtonText}</span>
      </span>
    </button>
  ), [expandButtonText, open, expandSidebar]);

  return (
    <>
      <nav className={className + (open ? expandedClassName : shrunkenClassName)}>
        <ul className="w-screen h-screen sm:h-auto sm:w-auto overflow-y-auto overflow-x-hidden mb-16 md:mb-0">
          {linkData.map((link, index) => <SidebarLink key={index} icon={link.icon} to={link.to}>{link.title}</SidebarLink>)}
        </ul>
        <ExpanderButton className="hidden sm:block" />
      </nav>
      <ExpanderButton className="sm:hidden block z-50" />
      <div className={open ? expandedWidth : shrunkenWidth}>&nbsp;</div>
    </>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: SVG;
  children: string;
};
const SidebarLink: React.FunctionComponent<SidebarLinkProps> = (props: SidebarLinkProps) => {
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
