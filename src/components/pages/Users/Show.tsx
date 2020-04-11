import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { User } from '../../../spamtitan/User';
import { api } from '../../../App';
import { BaseResponseObject, ErrorResponse, ValidationErrors } from '../../../spamtitan/types';
import { responseIsDataObject, responseIsError } from '../../../spamtitan/API';
import { Notice, SuccessLevel } from '../../structure/pre-styled/Notice';
import Breadcrumbs from '../../structure/Breadcrumbs';
import { Section } from '../../structure/Section';
import TextInput from '../../structure/pre-styled/TextInput';
import Label from '../../structure/pre-styled/Label';
import Button from '../../structure/pre-styled/Button';
import { isValidationErrors } from '../../structure/pre-styled/Notice';
import { RootObject } from '../../../spamtitan/types';
import { AuthContext } from '../../../AuthContext';

export const UserShow: React.FunctionComponent = () => {
  const { id } = useParams();
  const userId = +(id as string);
  const [user, setUser] = useState<User | {}>({});
  const [error, setError] = useState<string>('');
  let { url } = useRouteMatch();
  let { authStatus } = useContext(AuthContext);

  useEffect(() => {
    if (userId === (authStatus.user as User).id) {
      setUser((authStatus.user as User));
    } else {
      api.query<User>('GET', `users/${userId}`)
        .then((response: BaseResponseObject<User>) => {
          if (responseIsDataObject(response)) {
            setUser((response.object as User));
          } else {
            setError((response as ErrorResponse).error);
          }
        });
    }
  }, [authStatus.user, userId])

  return (
    <>
      <Breadcrumbs.Generator path={url} />
      <Notice errors={[error]} />
      <Section title="User Management" tagline="Manage generic user details." expanded={true}>
        <Label className="flex items-center content-center text-center mb-10">
          <span className="mr-5">Email Address:</span>
          <TextInput readOnly={true} value={(user as User).email} />
        </Label>
        <NameArea user={(user as User)} />
        <PasswordArea user={(user as User)} />
      </Section>
      {/* <div className={(user as User).email === 'admin' ? 'hidden' : 'block'}> */}
        <Section title="Allow List" tagline="Specify allowed emails and domains.">
        </Section>
        <Section title="Block List" tagline="Specify blocked emails and domains.">
        </Section>
      {/* </div> */}
    </>
  );
}

interface AreaProps {
  user: User,
}

const NameArea: React.FC<AreaProps> = ({ user }: AreaProps) => {
  const [errors, setErrors] = useState<string | string[] | ValidationErrors>([]);
  const [successLevel, setSuccessLevel] = useState(SuccessLevel.error);
  const [toHighlight, setToHighlight] = useState<string[]>([]);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [comment, setComment] = useState(user.comment);

  useEffect(() => {
    if (isValidationErrors(errors)) {
      setToHighlight(Object.keys(errors));
    }
  }, [errors]);

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setComment(user.comment);
  }, [user])

  const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const data: { first_name?: string, last_name?: string, comment?: string } = {
      first_name: firstName,
      last_name: lastName,
      comment: comment,
    };
    api.query<User>('PUT', `users/${user.id}`, data)
      .then((response: BaseResponseObject<User>) => {
        if (responseIsError(response)) {
          setErrors(response.error);
          setSuccessLevel(SuccessLevel.error);
        } else {
          setSuccessLevel(SuccessLevel.success);
          setErrors('Successfully updated the name fields on the user.');
        }
      }).catch(error => {
        if (responseIsError(error)) {
          setErrors(error.error);
          setSuccessLevel(SuccessLevel.error);
        } else {
          setErrors(error);
          setSuccessLevel(SuccessLevel.warning);
        }
      })
  }

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold">Set User's name</h3>
      <p className="max-w-xl text-sm">
        The first and last name are used internally in SpamTitan for preventing spam
        that attempts to impersonate a user. The comment is just some information
        about a user, such as they are an administrator, or are the CEO, or equivelent.
      </p>
      <div className="flex flex-wrap w-full mt-2">
        <span className="mr-4">
          <Label for="first_name">First Name
            <TextInput name="first_name"
              value={firstName}
              onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setFirstName(ev.target?.value)}
              error={toHighlight.includes('first_name')} />
          </Label>
        </span>
        <span className="mr-4">
          <Label for="last_name">Last Name
            <TextInput name="last_name"
              value={lastName}
              onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setLastName(ev.target?.value)}
              error={toHighlight.includes('last_name')} />
          </Label>
        </span>
        <span className="mr-4">
          <Label for="comment">Comment
            <TextInput name="comment"
              value={comment}
              onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setComment(ev.target?.value)}
              error={toHighlight.includes('comment')} />
          </Label>
        </span>
      </div>
      <Button onClick={save}>Save</Button>
      <Notice errors={errors} successLevel={successLevel} />
    </div>
  );
}

const PasswordArea: React.FC<AreaProps> = (props: AreaProps) => {
  const [errors, setErrors] = useState<string[] | ValidationErrors>([]);
  const [successLevel, setSuccessLevel] = useState(SuccessLevel.error);
  const [toHighlight, setToHighlight] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isValidationErrors(errors)) {
      setToHighlight(Object.keys(errors));
    }
  }, [errors]);

  const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    api.query<RootObject>('PUT', 'auth/password', {
      password: password,
      confirm_password: confirmPassword,
    }).then((response: BaseResponseObject<RootObject>) => {
      if (responseIsError(response)) {
        setErrors(response.error);
        setSuccessLevel(SuccessLevel.error);
      } else {
        setErrors(['Successfully updated password!']);
        setSuccessLevel(SuccessLevel.success);
      }
    }).catch((error) => {
      if (responseIsError(error)) {
        setErrors(error.error);
        setSuccessLevel(SuccessLevel.error);
      } else {
        setErrors(error);
        setSuccessLevel(SuccessLevel.warning);
      }
    });
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold">Set a new password</h3>
      <p>
      </p>
      <div className="flex w-1/2">
        <span className="mr-4">
          <Label for="password">New Password
            <TextInput name="password"
              value={password}
              onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target?.value)}
              error={toHighlight.includes('password')} />
          </Label>
        </span>
        <span className="mr-4">
          <Label for="confirm_password">Confirm Password
            <TextInput name="confirm_password"
              value={confirmPassword}
              onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setConfirmPassword(ev.target?.value)}
              error={toHighlight.includes('confirm_password')} />
          </Label>
        </span>
      </div>
      <Button onClick={save}>Save</Button>
      <Notice errors={errors} successLevel={successLevel} />
    </div>
  );
}
