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
            <Route path="/nominations" component={Nominations} />
            <Route path="/competitors" component={Competitors} />
            <Route path="/add-competitor/:competitorId?" component={AddCompetitor} />
            <Route path="/register-admin" component={RegisterAdmin} />
            <Route path="/login-admin" component={Login} />
            <Route exact path="/" component={Home} />
          </Switch>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
