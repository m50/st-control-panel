import React from 'react';

interface Props {
  children: React.ReactNode,
  for?: string,
  className?: string,
}

export default (props: Props): JSX.Element => {
  return <label htmlFor={props.for} className={"text-gray-900 font-bold " + props.className}>{props.children}</label>
}
