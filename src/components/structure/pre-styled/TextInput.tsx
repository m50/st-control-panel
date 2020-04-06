import React from 'react';

interface Props {
  type?: 'text' | 'password' | 'number',
  readOnly?: boolean,
  placeholder?: string,
  value?: string | number,
  error?: boolean,
  className?: string,
}

export default (props: Props) => {
  return (<input
    className={"text-gray-800 px-5 py-2 border bg-gray-300 block rounded-lg mt-2 "
      + (props.error ? 'border-red-600 ' : 'border-gray-500 ')
      + (props.readOnly ? 'focus:outline-none ' : ' ')
      + props.className}
    type={props.type ?? 'text'}
    readOnly={props.readOnly ?? false}
    placeholder={props.placeholder}
    value={props.value} />);
}
