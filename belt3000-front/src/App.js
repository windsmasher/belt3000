import './App.css';
import React, { useState, useEffect } from 'react';
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
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import AddAdmin from './views/AddAdmin';
import NewPassword from './views/NewPassword';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    login();
  }, []);

  const login = dataToken => {
    const authData = dataToken || JSON.parse(localStorage.getItem('userData'));

    if (authData) {
      setToken(authData.token);
      localStorage.setItem('userData', JSON.stringify({ token: authData.token }));
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('userData');
  };

  const theme = extendTheme({
    components: {
      Table: {
        baseStyle: {
          variant: 'striped',
        },
      },
    },
    breakpoints: ['30em', '68em', '78em', '96em'],
  });

  return (
    <ChakraProvider theme={theme}>
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
            {/* <PrivateRoute component={Navbar} /> */}
            {!!token ? <Navbar /> : null}
            <Switch>
              <PrivateRoute path="/nominations" component={Nominations} />
              <PrivateRoute path="/competitors" component={Competitors} />
              <PrivateRoute path="/add-competitor/:competitorId?" component={AddCompetitor} />
              <PrivateRoute path="/add-nomination/:competitorId" component={AddNomination} />
              <PrivateRoute path="/add-admin" component={AddAdmin} />
              <PrivateRoute path="/new-password" component={NewPassword} />
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
