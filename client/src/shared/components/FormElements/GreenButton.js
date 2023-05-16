import React from 'react';
import { Link } from 'react-router-dom';

import './GreenButton.css';

const GreenButton = props => {
  if (props.href) {
    return (
      <a
        className={`gbutton gbutton--${props.size || 'default'} ${props.inverse &&
          'gbutton--inverse'} ${props.danger && 'gbutton--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`gbutton gbutton--${props.size || 'default'} ${props.inverse &&
          'gbutton--inverse'} ${props.danger && 'gbutton--danger'}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`gbutton gbutton--${props.size || 'default'} ${props.inverse &&
        'gbutton--inverse'} ${props.danger && 'gbutton--danger'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default GreenButton;
