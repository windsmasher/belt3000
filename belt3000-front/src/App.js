import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Competitors from './views/Competitors';
import Home from './views/Home';
import Nominations from './views/Nominations';
import AddCompetitor from './views/AddCompetitor';
import ErrorBoundary from './components/ErrorBoundary';
import RegisterAdmin from './views/Register';
import AddNomination from './views/AddNomination';
import Login from './views/Login';
import { AuthContext } from './context';
import PrivateRoute from './components/PrivateRoute';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import AddAdmin from './views/AddAdmin';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((token, expirationTime) => {
    setToken(token);
    const expiration = expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(expiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        expirationTime: expiration.toISOString(),
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expirationTime) > new Date()) {
      login(storedData.token, new Date(storedData.expirationTime));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return (
    <ChakraProvider>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          login: login,
          logout: logout,
        }}
      >
        <ErrorBoundary>
          <Router>
            <Header />
            {!!token ? <Navbar /> : null}
            <Switch>
              <PrivateRoute path="/nominations" component={Nominations} />
              <PrivateRoute path="/competitors" component={Competitors} />
              <PrivateRoute path="/add-competitor/:competitorId?" component={AddCompetitor} />
              <PrivateRoute path="/add-nomination/:competitorId" component={AddNomination} />
              <PrivateRoute path="/add-admin" component={AddAdmin} />
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login-admin" component={Login} />
              <Route path="/register-admin" component={RegisterAdmin} />
            </Switch>
          </Router>
        </ErrorBoundary>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;
