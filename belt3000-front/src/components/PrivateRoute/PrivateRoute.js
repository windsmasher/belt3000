import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps => (authContext.isLoggedIn ? <Component {...routeProps} /> : <Redirect to="/login-admin" />)}
    />
  );
};

export default PrivateRoute;
