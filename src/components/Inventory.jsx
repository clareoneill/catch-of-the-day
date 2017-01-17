import React, {PropTypes} from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

const propTypes = {
  fishes      : PropTypes.object.isRequired,
  addFish     : PropTypes.func.isRequired,
  updateFish  : PropTypes.func.isRequired,
  removeFish  : PropTypes.func.isRequired,
  loadSamples : PropTypes.func.isRequired,
  storeId     : PropTypes.string.isRequired,
};

class Inventory extends React.Component {
  state = {
    uid   : null,
    owner : null
  };

  propTypes = propTypes;

  componentDidMount () {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, {user});
      }
    });
  }

  handleChange = (e, key) => {
    const fish = this.props.fishes[key];
    // take a copy of that fish and update it with the new data
    const updatedFish = {
      ...fish,
      [e.target.name] : e.target.value
    };
    this.props.updateFish(key, updatedFish);
  };

  authenticate = (provider) => {
    console.log('trying to log in with' + provider);
    base.authWithOAuthPopup(provider, this.authHandler);
  };

  authHandler = (err, authData) => {
    if (err) {
      console.error(err);
      return;
    }

    // grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // query firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // claim it as our own if no owner already
      if (!data.owner) {
        storeRef.set({
          owner : authData.user.uid
        });
      }

      this.setState({
        uid   : authData.user.uid,
        owner : data.owner || authData.user.uid
      });
    })
  };

  logout = () => {
    base.unauth();
    this.setState({
      uid : null
    });
  }

  renderLogin = () => {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store&rsquo;s inventory.</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
      </nav>
    );
  };

  renderInventory = (key) => {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish name" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish price" onChange={(e) => this.handleChange(e, key)}/>
        <select type="text" name="status" value={fish.status} placeholder="Fish status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh</option>
          <option value="unavailable">Sold out</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish desc" onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="image" value={fish.image} placeholder="Fish image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove fish</button>
      </div>
    );
  };

  render () {
    const logout = <button onClick={this.logout}>Log out.</button>

    // check if they are not logged in
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>;
    }

    // check if they are the owner of the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you&rsquo;re not the owner of this store.</p>
          {logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Load sample fishes</button>
      </div>
    );
  }
}

export default Inventory;