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

interface GeneratorProps {
  path: string,
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

  static Generator: React.FunctionComponent<GeneratorProps> = (props: GeneratorProps) => {
    const parts = props.path.split('/').filter((part) => part.length > 0);
    return (
      <Breadcrumbs>
        {parts.map((part, i) => {
          return <Breadcrumbs.Item key={i} name={part} link={'/' + parts.filter((part, l) => l <= i).join('/')} />;
        })}
      </Breadcrumbs>
    )
  }

  static Separator: React.FunctionComponent = () => {
    return <span className="mx-5 font-bold text-lg text-gray-400"><CheveronRight className="inline fill-current h-5 w-5" /></span>;
  }

  render() {
    return (
      <div className="my-3 px-2">
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
