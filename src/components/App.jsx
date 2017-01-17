import React, { PropTypes } from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

const propTypes  = {
  params : PropTypes.object.isRequired
};

class App extends React.Component {
  state = {
    fishes : {},
    order  : {}
  };

  propTypes = propTypes;

  componentWillMount () {
    // this runs right before the <App /> is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context : this,
      state   : 'fishes'
    });

    // check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
    if (localStorageRef) {
      // update our <App>'s order state
      this.setState({
        order : JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUpdate (nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  componentWillUnmount () {
    base.removeBinding(this.ref);
  }

  addFish = (fish) => {
    // update our state
    const fishes = {...this.state.fishes};
    // add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set state
    this.setState({fishes});
  };

  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({fishes});
  };

  removeFish = (key) => {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({fishes});
  };

  loadSamples = () => {
    this.setState({
      fishes : sampleFishes
    })
  };

  addToOrder = (key) => {
    // take a copy of our state
    const order = {...this.state.order};
    // update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // update our state
    this.setState({order});
  };

  removeFromOrder = (key) => {
    // take a copy of our state
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});
  };

  render () {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key}
                                  index={key}
                                  details={this.state.fishes[key]}
                                  addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>
        <Order fishes={this.state.fishes}
               order={this.state.order}
               storeId={this.props.params.storeId}
               removeFromOrder={this.removeFromOrder}/>
        <Inventory addFish={this.addFish}
                   updateFish={this.updateFish}
                   removeFish={this.removeFish}
                   loadSamples={this.loadSamples}
                   fishes={this.state.fishes}
                   storeId={this.props.params.storeId} />
      </div>
    );
  }
}

export default App;