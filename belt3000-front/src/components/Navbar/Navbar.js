import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav>
    <div className="navbar">
      <NavLink to="/" exact>
        <div>Strona główna</div>
      </NavLink>
      <NavLink to="/competitors">
        <div className="navbar__pill">Zawodnicy</div>
      </NavLink>
      <NavLink to="/nominations">
        <div className="navbar__pill">Nominacje</div>
      </NavLink>
      <NavLink to="/register-admin">
        <div className="navbar__pill">Zarejestruj się</div>
      </NavLink>
      <NavLink to="/login-admin">
        <div className="navbar__pill">Zaloguj się</div>
      </NavLink>
    </div>
  </nav>
);

export default Navbar;
