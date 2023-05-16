import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const navigator = useNavigate();

  const logoutHandler = () => {
    auth.logout();
    navigator('/', { replace: true });
  };

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <>
          {auth.isTeacher && (
            <li>
              <NavLink to={`/classroom/new`}>CREATE CLASSROOM</NavLink>
            </li>
          )}
          <li>
            <NavLink to={`/classroom/all`}>ALL CLASSROOMS</NavLink>
          </li>
          <li>
            <button onClick={logoutHandler}>LOGOUT</button>
          </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Enter Website</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
