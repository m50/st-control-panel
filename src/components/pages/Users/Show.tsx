import React, { useState, useEffect } from 'react';
import { AuthStatusProps } from '../../../types';
import { useParams, useRouteMatch } from 'react-router';
import { User } from '../../../spamtitan/User';
import { api } from '../../../App';
import { BaseResponseObject, ErrorResponse, ValidationErrors } from '../../../spamtitan/types';
import { responseIsDataObject } from '../../../spamtitan/API';
import { ErrorBlock } from '../../structure/pre-styled/Error';
import Breadcrumbs from '../../structure/Breadcrumbs';
import { Section } from '../../structure/Section';
import TextInput from '../../structure/pre-styled/TextInput';
import Label from '../../structure/pre-styled/Label';
import Button from '../../structure/pre-styled/Button';
import { isValidationErrors } from '../../structure/pre-styled/Error';

interface Props extends AuthStatusProps { }

export const UserShow: React.FunctionComponent<Props> = (props: Props) => {
  const { id } = useParams();
  const userId = +(id as string);
  const [user, setUser] = useState<User | {}>({});
  const [error, setError] = useState<string>('');
  let { url } = useRouteMatch();

  useEffect(() => {
    if (userId === (props.authStatus.user as User).id) {
      setUser((props.authStatus.user as User));
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
  }, [props.authStatus.user, userId])

  return (
    <>
      <Breadcrumbs.Generator path={url} />
      <ErrorBlock errors={[error]} />
      <Section title="User Management" tagline="Manage generic user details." expanded={true}>
        <div className="flex items-center content-center text-center mb-10 ">
          <Label className="mr-5">User's Email Address:</Label>
          <TextInput readOnly={true} value={(user as User).email} />
        </div>
        <NameArea user={(user as User)} />
        <PasswordArea user={(user as User)} />
      </Section>
      <Section title="Allow List" tagline="Specify allowed emails and domains.">
      </Section>
      <Section title="Block List" tagline="Specify blocked emails and domains.">
      </Section>
    </>
  );
}

interface AreaProps {
  user: User,
}

const NameArea: React.FC<AreaProps> = (props: AreaProps) => {
  const [errors, setErrors] = useState<string[] | ValidationErrors>([]);
  const [toHighlight, setToHighlight] = useState<string[]>([]);

  useEffect(() => {
    if (isValidationErrors(errors)) {
      setToHighlight(Object.keys(errors));
    }
  }, [errors]);

  const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setErrors([]);
  }

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-semibold">Set User's name</h3>
      <div className="flex w-full">
        <span className="mr-4">
          <Label for="first_name">First Name</Label>
          <TextInput name="first_name" value={props.user.first_name} error={toHighlight.includes('first_name')} />
        </span>
        <span className="mr-4">
          <Label for="last_name">Last Name</Label>
          <TextInput name="last_name" value={props.user.last_name} error={toHighlight.includes('last_name')} />
        </span>
        <span className="mr-4">
          <Label for="comment">Comment</Label>
          <TextInput name="comment" value={props.user.comment} error={toHighlight.includes('comment')} />
        </span>
      </div>
      <Button onClick={save}>Save</Button>
      <ErrorBlock errors={errors} />
    </div>
  );
}

const PasswordArea: React.FC<AreaProps> = (props: AreaProps) => {
  const [errors, setErrors] = useState<string[] | ValidationErrors>([]);
  const [toHighlight, setToHighlight] = useState<string[]>([]);

  useEffect(() => {
    if (isValidationErrors(errors)) {
      setToHighlight(Object.keys(errors));
    }
  }, [errors]);

  const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setErrors({
      password: [
        'Password is too short.',
        'Password does not contain required characters.',
      ],
      confirm_password: [
        'Confirm password does not match password.',
      ],
    });
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold">Set a new password</h3>
      <div className="flex w-1/2">
        <span className="mr-4">
          <Label for="password">New Password</Label>
          <TextInput name="password" error={toHighlight.includes('password')} />
        </span>
        <span className="mr-4">
          <Label for="confirm_password">Confirm Password</Label>
          <TextInput name="confirm_password" error={toHighlight.includes('confirm_password')} />
        </span>
      </div>
      <Button onClick={save}>Save</Button>
      <ErrorBlock errors={errors} />
    </div>
  );
}
