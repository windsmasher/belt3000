import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../../context';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  return (
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
      <Nav.Item>
        <a className="nav-unactive" href="/login-admin" onClick={() => authContext.logout()}>
          Wyloguj się
        </a>
      </Nav.Item>
    </Nav>
  );
};

export default Navbar;
