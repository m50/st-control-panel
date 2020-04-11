import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import { UserShow } from './Show';
import Container from '../../structure/Container';

export const UserRouter: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route exact path={`${path}/:id`}>
          <UserShow />
        </Route>
      </Switch>
    </Container>
  );
}
