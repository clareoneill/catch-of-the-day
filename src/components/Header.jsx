import React, { PropTypes } from 'react';

const propTypes = {
  tagline : PropTypes.string.isRequired
};

const Header = (props) => {
  return (
    <header className="top">
      <h1>
        Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
        day
      </h1>
      <h3 className="tagline"><span>{props.tagline}</span></h3>
    </header>
  );
}

Header.propTypes = propTypes;

export default Header;