import './App.css';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Competitors from './views/Competitors';
import Home from './views/Home';
import Nominations from './views/Nominations';
import AddCompetitor from './views/AddCompetitor';
import ErrorBoundary from './components/ErrorBoundary';
import RegisterAdmin from './views/Register';
import AddNomination from './views/AddNomination';
import Login from './views/Login';
import { AuthContext } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import AddAdmin from './views/AddAdmin';
import NewPassword from './views/NewPassword';

const App = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.login();

    console.log(authContext.login);
  }, []);

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
    <AuthContext.Provider>
      <ChakraProvider theme={theme}>
        <ErrorBoundary>
          <Router>
            <Header />
            {authContext.isLoggedIn ? <Navbar /> : null}
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
      </ChakraProvider>
    </AuthContext.Provider>
  );
};

export default App;
