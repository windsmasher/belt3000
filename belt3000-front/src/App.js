import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Competitors from './views/Competitors/Competitors';
import Home from './views/Home/Home';
import Nominations from './views/Nominations/Nominations';
import Navbar from './components/Navbar/Navbar';
import AddCompetitor from './views/AddCompetitor/AddCompetitor';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import RegisterAdmin from './views/Register/Register';
import AddNomination from './views/AddNomination/AddNomination';
import Login from './views/Login/Login';
import { AuthContext } from './context';

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
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <div>
          <ErrorBoundary>
            {!!token ? (
              <div>
                <Navbar />
                <Switch>
                  <Route path="/nominations" component={Nominations} />
                  <Route path="/competitors" component={Competitors} />
                  <Route path="/add-competitor/:competitorId?" component={AddCompetitor} />
                  <Route path="/add-nomination/:competitorId" component={AddNomination} />
                  <Route exact path="/" component={Home} />
                </Switch>
              </div>
            ) : (
              <Switch>
                <Route path="/login-admin" component={Login} />
                <Route path="/register-admin" component={RegisterAdmin} />
              </Switch>
            )}
          </ErrorBoundary>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
