import React, { useState } from 'react';
import { ReactComponent as CheveronDown } from '../zondicons/cheveron-down.svg';
import { ReactComponent as CheveronUp } from '../zondicons/cheveron-up.svg';
import AnimateHeight from 'react-animate-height';

interface Props {
  children: React.ReactNode,
  title: string,
  tagline?: string,
  expanded?: boolean,
  collapsable?: boolean,
}

export const Section: React.FunctionComponent<Props> = (props: Props) => {
  const collapsable = props.collapsable ?? true;
  const expanded = props.expanded ?? false;
  const defaultExpanded = expanded || !collapsable;

  const [height, setHeight] = useState<number | string>(defaultExpanded ? 'auto' : 0);

  const toggleExpand = () => {
    setHeight(height === 0 ? 'auto' : 0);
  }

  const Cheveron = height === 'auto' ? CheveronUp : CheveronDown;
  return (
    <section className="text-gray-900 border-b border-gray-400 py-5">
      <div className="flex justify-between mb-6 content-center">
        <span className="w-3/4">
          <h2 className="font-bold text-2xl">{props.title}</h2>
          <h3 className="text-xl">{props.tagline}</h3>
        </span>
        <span className={"h-10 w-10 " + (!collapsable ? 'hidden' : '')}>
          <button className="
            text-gray-900 h-10 w-10
            hover:text-orange-600
          " onClick={toggleExpand}>
            <span className="sr-only">{height === 0 ? 'Expand section' : 'Collapse section'}</span>
            <Cheveron className="fill-current" />
          </button>
        </span>
      </div>
      <AnimateHeight duration={500} height={height}>
        <div>
          {props.children}
        </div>
      </AnimateHeight>
    </section>
  );
};
