import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { AuthStatus } from '../../types';
import { Redirect } from 'react-router';
import { api } from '../../App';
import config from '../../configuration.json';
import { ErrorResponse, ValidationErrors } from '../../spamtitan/types';
import { User } from '../../spamtitan/User';
import TextInput from '../structure/pre-styled/TextInput';
import Label from '../structure/pre-styled/Label';
import { Notice } from '../structure/pre-styled/Notice';
import { AuthContext, initAuthStatus } from '../../AuthContext';

interface FormState { // State for the login form;
  email: string,
  password: string,
  errors: string[] | ValidationErrors,
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string | string[] | ValidationErrors>([]);
  const { setAuthStatus } = useContext(AuthContext);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    api.auth(email, password)
      .then((user: User) => {
        const authStatus: AuthStatus = {
          loggedIn: true,
          keys: api.getKeys(),
          user: user,
        };
        setTimeout(() => setAuthStatus(initAuthStatus), config.logoutTimer /* minutes */ * 60 /* seconds */ * 1000 /* milliseconds */);
        setAuthStatus(authStatus);
      })
      .catch((data: ErrorResponse) => {
        if ((data as ErrorResponse).error) {
          const error = (data as ErrorResponse).error;
          setErrors(error);
        }
      });
  }

  return (
      <form onSubmit={handleSubmit}
        className="w-screen sm:w-auto h-screen sm:h-auto pt-16 sm:pt-0
          bg-gray-200 rounded border-b border-orange-400 dark:bg-gray-800">
        <h2 className="hidden sm:block text-lg w-full text-white
            bg-orange-400 py-2 px-2 rounded-t">
          Login:
        </h2>
        <div className="h-full sm:h-auto flex flex-col justify-center sm:justify-between px-10 py-5">
          <div className="py-2">
            <Label>Email</Label>
            <TextInput value={email} onchangeEvent={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target?.value)} />
          </div>
          <div className="py-2">
            <Label>Password</Label>
            <TextInput value={password} type="password" onchangeEvent={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target?.value)} />
          </div>
          <input type="submit"
            className="text-white bg-orange-400 mt-8 py-2 px-4 rounded hover:bg-orange-500"
            value="Login" />
          <Notice errors={errors} />
        </div>
      </form>
    );
}

// The form wrapper for styling purposes.
export default () => {
  const { authStatus } = useContext(AuthContext);
  if (authStatus.loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="flex flex-col content-center justify-center h-screen w-screen">
      <div className="flex content-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
