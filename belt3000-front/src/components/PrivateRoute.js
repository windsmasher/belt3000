import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useSelector(state => state.authData);
  return (
    <Route {...rest} render={routeProps => (token ? <Component {...routeProps} /> : <Redirect to="/login-admin" />)} />
  );
};

export default PrivateRoute;
