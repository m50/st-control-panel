import React, { ChangeEvent, FormEvent } from 'react';
import { AuthStatus, AuthStatusProps } from '../../types';
import { Redirect } from 'react-router';
import { api, initAuthStatus } from '../../App';
import config from '../../configuration.json';
import { ErrorResponse, ValidationErrors } from '../../spamtitan/types';
import { User } from '../../spamtitan/User';
import TextInput from '../structure/pre-styled/TextInput';
import Label from '../structure/pre-styled/Label';
import { ErrorBlock, isValidationErrors } from '../structure/pre-styled/Error';

// The types to use in this file.
interface Props extends AuthStatusProps { } // The props for the LoginPage component.
interface FormProps extends Props { } // Props for the login form; same as LoginPage for now.
interface FormState { // State for the login form;
  email: string,
  password: string,
  errors: string[] | ValidationErrors,
}

class LoginForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
    };
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    api.auth(this.state.email, this.state.password)
      .then((user: User) => {
        const authStatus: AuthStatus = {
          loggedIn: true,
          keys: api.getKeys(),
          user: user,
        };
        setTimeout(() => this.props.setAuthStatus(initAuthStatus), config.logoutTimer /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */);
        this.props.setAuthStatus(authStatus);
      })
      .catch((data: ErrorResponse) => {
        if ((data as ErrorResponse).error) {
          const error = (data as ErrorResponse).error;
          if (isValidationErrors(error)) {
            this.setState({ errors: error });
          } else {
            this.setState({ errors: [error] });
          }
        }
      });
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
          bg-gray-200 rounded border-b border-orange-400 dark:bg-gray-800">
        <h2 className="hidden sm:block text-lg w-full text-white
            bg-orange-400 py-2 px-2 rounded-t">
          Login:
        </h2>
        <div className="h-full sm:h-auto flex flex-col justify-center sm:justify-between px-10 py-5">
          <div className="py-2">
            <Label>Email</Label>
            <TextInput value={this.state.email} onchangeEvent={this.handleEmailInput} />
          </div>
          <div className="py-2">
            <Label>Password</Label>
            <TextInput value={this.state.password} type="password" onchangeEvent={this.handlePasswordInput} />
          </div>
          <input type="submit"
            className="text-white bg-orange-400 mt-8 py-2 px-4 rounded hover:bg-orange-500"
            value="Login" />
          <ErrorBlock errors={this.state.errors} />
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
