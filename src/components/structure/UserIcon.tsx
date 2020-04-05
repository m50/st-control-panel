import React from 'react';
import { AuthStatusProps } from '../../types';

interface Props extends AuthStatusProps { }

export default class UserIcon extends React.Component<Props> {
  render() {
    if (this.props.authStatus.loggedIn) {
      return <span></span>;
    }
    return (
      <a href="/" className="bg-white my-2 mx-5 rounded-full w-10 h-10 leading-10 text-black text-center align-middle text-xl">
        MC
      </a>
    );
  }
}
