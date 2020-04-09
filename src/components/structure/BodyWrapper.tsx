import React from 'react';
import { Redirect } from 'react-router';
import Sidebar from './Sidebar';

interface BodyWrapperProps {
  children: React.ReactNode,
  loggedIn: boolean
}

export const BodyWrapper: React.FunctionComponent<BodyWrapperProps> = (props: BodyWrapperProps) => {
  if (!props.loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <div id="body" className="z-0 fixed top-0 left-0 h-screen w-screen flex dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="pt-14 h-full sm:w-11/12 max-w-screen inline-block">
        {props.children}
      </div>
    </div>
  );
}
