import React from 'react';

interface Props {
  type?: 'text' | 'password' | 'number',
  readOnly?: boolean,
  placeholder?: string,
  value?: string | number,
  error?: boolean,
  className?: string,
  onchangeEvent?: any,
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
}

export default (props: Props) => {
  const renderIcon = () => {
    if (props.icon) {
      return (
        <props.icon className="
            text-gray-500 pointer-events-none inline-block absolute top-0 left-0
            fill-current h-6 w-6 inline-block mt-2 ml-2
          " />
      )
    }

    return <></>;
  }
  return (
    <div className="relative">
      {renderIcon()}
      <input
        className={"text-gray-800 px-5 py-2 border bg-gray-300 block rounded-lg mt-2 "
          + (props.error ? 'border-red-600 ' : 'border-gray-500 ')
          + (props.readOnly ? 'focus:outline-none ' : ' ')
          + (props.icon ? 'pl-10 ' : ' ')
          + props.className
        }
        type={props.type ?? 'text'}
        readOnly={props.readOnly ?? false}
        placeholder={props.placeholder}
        onChange={props.onchangeEvent}
        value={props.value} />
    </div>
  );
}
