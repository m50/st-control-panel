import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import Container from '../../structure/Container';
import { DomainList } from './List';


export const UserRouter: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route exact path={`${path}`}>
          <DomainList />
        </Route>
        <Route exact path={`${path}/:id`}>
          {/* Show */}
        </Route>
      </Switch>
    </Container>
  );
}
