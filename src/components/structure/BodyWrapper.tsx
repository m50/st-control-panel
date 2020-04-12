import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { Sidebar } from './Sidebar';
import { AuthContext } from '../../AuthContext';

interface BodyWrapperProps {
  children: React.ReactNode,
}

export const BodyWrapper: React.FunctionComponent<BodyWrapperProps> = (props: BodyWrapperProps) => {
  const { authStatus } = useContext(AuthContext);
  if (!authStatus.loggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div id="body" className="z-0 left-0 min-h-screen w-screen flex bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="pt-14 w-full sm:w-1/2 md:w-2/3 lg:w-5/6 max-w-screen inline-block">
        {props.children}
      </main>
    </div>
  );
}
