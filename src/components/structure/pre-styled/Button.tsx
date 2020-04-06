import React from 'react';

export default ({children, className, ...props}: any): JSX.Element => {

  return (
    <button className={
      "block px-5 py-2 bg-gray-300 rounded-lg border border-gray-500 mt-2 capitalize tracking-wide " +
      "hover:bg-orange-500 hover:text-white" +
      className
    } {...props}>
      {children}
    </button>
  );
}
