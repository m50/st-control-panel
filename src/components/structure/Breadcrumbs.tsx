import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as CheveronRight } from '../zondicons/cheveron-right.svg';


interface Props {
  children: React.ReactNode
}

interface ItemProps {
  name: string | number,
  link?: string,
}

export default class Breadcrumbs extends React.Component<Props> {
  static Item: React.FunctionComponent<ItemProps> = (props: ItemProps) => {
    const pProps = {
      className: "inline-block text-gray-600 " + (props.link ? 'hover:text-orange-500' : ''),
      activeClassName: "font-bold"
    };
    return props.link
      ? <NavLink exact {...pProps} to={props.link}>{props.name}</NavLink>
      : <p className={pProps.className}>{props.name}</p>;
  }

  static Separator: React.FunctionComponent = () => {
    return <span className="mx-5 font-bold text-lg text-gray-400"><CheveronRight className="inline fill-current h-5 w-5" /></span>;
  }

  render() {
    return (
      <div className="px-2">
        <div className="bg-gray-200 rounded-lg w-full py-1 px-8">
          {React.Children.map(this.props.children, (child, i) => {
            if (i > 0) {
              return <><Breadcrumbs.Separator />{child}</>
            }

            return child;
          })}
        </div>
      </div>
    );
  }
}
