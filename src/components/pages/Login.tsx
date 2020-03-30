import React, { ChangeEvent, FormEvent } from 'react';
import { AuthStatus } from '../../types';
import { Redirect } from 'react-router';
import { initAuthStatus } from '../../App';
import config from '../../configuration.json';

// The types to use in this file.
interface Props { // The props for the LoginPage component.
  authStatus: AuthStatus,
  setAuthStatus: CallableFunction,
}
interface FormProps extends Props { } // Props for the login form; same as LoginPage for now.
interface FormState { // State for the login form;
  email: string,
  password: string,
}

class LoginForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authStatus: AuthStatus = {
      loggedIn: true,
      keys: [],
      user: {},
    };
    setTimeout(() => this.props.setAuthStatus(initAuthStatus), config.logoutTimer /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */);
    this.props.setAuthStatus(authStatus);
  }

  handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({email: event.target?.value});
  }

  handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({password: event.target?.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}
        className="w-screen sm:w-auto h-screen sm:h-auto pt-16 sm:pt-0
          bg-gray-200 rounded border-b border-orange-400">
        <h2 className="hidden sm:block text-lg w-full text-white
            bg-orange-400 py-2 px-2 rounded-t">
          Login:
        </h2>
        <div className="h-full sm:h-auto flex flex-col justify-center sm:justify-between px-10 py-5">
          <label className="my-2">
            Email: <br />
            <input name="email"
              className="my-2 mx-1 px-2 py-1 w-full
                border-2 border-gray-400 rounded
                focus:border-orange-400 focus:outline-none"
              value={this.state.email}
              onChange={this.handleEmailInput} />
          </label>
          <label className="my-2">
            Password: <br />
            <input type="password"
              className="my-2 mx-1 px-2 py-1 w-full
                border-2 border-gray-400 rounded
                focus:border-orange-400 focus:outline-none"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordInput} />
          </label>
          <input type="submit"
            className="text-white bg-orange-400 mt-8 py-2 px-4 rounded hover:bg-orange-500"
            value="Login" />
        </div>
      </form>
    );
  }
}

// The form wrapper for styling purposes.
export default (props: Props) => {
  if (props.authStatus.loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="flex flex-col content-center justify-center h-screen w-screen">
      <div className="flex content-center justify-center">
        <LoginForm {...props} />
      </div>
    </div>
  );
}
