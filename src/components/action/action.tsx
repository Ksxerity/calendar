import React from 'react';
import propTypes from 'prop-types';

Action.propTypes = {
  src: propTypes.String
}

function Action(props) {
  return (
    <a>
      <img src={props.src}></img>
    </a>
  )
}

export default Action;