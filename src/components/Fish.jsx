import React, { PropTypes } from 'react';
import {formatPrice} from '../helpers';

const propTypes = {
  details    : PropTypes.object.isRequired,
  index      : PropTypes.string.isRequired,
  addToOrder : PropTypes.func.isRequired
};

class Fish extends React.Component {
  propTypes = propTypes;

  render () {
    const {details, index} = this.props;
    const isAvailable = details.status === 'available';
    const buttonText = isAvailable ? 'Add to order' : 'Sold out';
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name}/>
        <h3 className="fish-name">
          {details.name}
          <span className="price">{formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable}
                onClick={() => this.props.addToOrder(index)}>{buttonText}</button>
      </li>
    );
  }
}

export default Fish;