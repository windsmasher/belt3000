import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Competitors from './views/Competitors/Competitors';
import Home from './views/Home/Home';
import Nominations from './views/Nominations/Nominations';
import Navbar from './components/Navbar/Navbar';
import AddCompetitor from './views/AddCompetitor/AddCompetitor';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import RegisterAdmin from './views/Register/Register';
import Login from './views/Login/Login';

function App() {
  return (
    <Router>
      <div>
        <ErrorBoundary>
          <Navbar />
          <Switch>
            <Route path="/nominations">
              <Nominations />
            </Route>
            <Route path="/competitors">
              <Competitors />
            </Route>
            <Route path="/add-competitor">
              <AddCompetitor />{' '}
            </Route>
            <Route path="/register-admin">
              <RegisterAdmin />{' '}
            </Route>
            <Route path="/login-admin">
              <Login />{' '}
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
