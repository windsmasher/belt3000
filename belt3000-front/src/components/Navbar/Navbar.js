import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <Nav fill>
    <Nav.Item>
      <NavLink to="/" exact activeClassName="nav-active" className="nav-unactive">
        Strona główna
      </NavLink>
    </Nav.Item>
    <Nav.Item>
      <NavLink to="/competitors" activeClassName="nav-active" className="nav-unactive">
        Zawodnicy
      </NavLink>
    </Nav.Item>
    <Nav.Item>
      <NavLink to="/nominations" activeClassName="nav-active" className="nav-unactive">
        Nominacje
      </NavLink>
    </Nav.Item>
    {localStorage.getItem('token') ? (
      <Nav.Item>
        <a className="nav-unactive" href="/" onClick={() => localStorage.clear()}>
          Wyloguj się
        </a>
      </Nav.Item>
    ) : (
      <Nav.Item>
        <NavLink to="/login-admin" activeClassName="nav-active" className="nav-unactive">
          Zaloguj się
        </NavLink>
      </Nav.Item>
    )}
  </Nav>
);

export default Navbar;
