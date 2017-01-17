import React, {PropTypes} from 'react';
import { getFunName } from '../helpers';

const contextTypes = {
  router : PropTypes.object
};

class StorePicker extends React.Component {
  contextTypes = contextTypes;

  goToStore = (e) => {
    e.preventDefault();
    const storeId = this.storeInput.value;
    this.context.router.transitionTo(`/store/${storeId}`);
  };

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please enter a store</h2>
        <input type="text" required placeholder="Store name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}} />
        <button type="submit">Visit store</button>
      </form>
    );
  }
}

export default StorePicker;
