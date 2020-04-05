import React from 'react';

export default (props: { children: React.ReactNode }): JSX.Element => (
  <div className="flex justify-center min-h-full py-2">
    <main className="mx-2 w-full sm:w-5/6 lg:w-1/2">
      {props.children}
    </main>
  </div>
);
