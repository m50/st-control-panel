import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { AuthStatusProps } from '../../../types';
import { UserShow } from './Show';
import { BodyWrapper } from '../../structure/BodyWrapper';
import Container from '../../structure/Container';

interface Props extends AuthStatusProps {

}

export const UserRouter: React.FC<Props> = (props: Props) => {
  let { path } = useRouteMatch();
  const authStatusComponents = { authStatus: props.authStatus, setAuthStatus: props.setAuthStatus };
  return (
    <BodyWrapper loggedIn={props.authStatus.loggedIn}>
      <Container>
        <Switch>
          <Route exact path={`${path}/:id`}>
            <UserShow {...authStatusComponents} />
          </Route>
        </Switch>
      </Container>
    </BodyWrapper>
  );
}
