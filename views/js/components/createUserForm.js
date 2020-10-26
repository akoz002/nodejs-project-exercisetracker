'use strict';

import { createUserAsync, store } from './redux.js';
import { JSONObjectCodeBlock } from './jsonDisplays.js';

/*
 * Form to create a new user.
 */

class CreateUserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  // input 'onChange' handler
  handleChange(e) {
    this.setState({
      input: e.target.value
    });
  }

  // button 'onSubmit' handler
  createUser(e) {
    e.preventDefault();

    // dispatch async action to create a new user
    this.props.dispatchCreateUser(this.state.input);
    this.setState({
      input: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.createUser}>
        <h2>Create a New User</h2>
        <p><code className='code-inline'>POST /api/exercise/new-user</code></p>

        <div class='input-container'>
          <label for='uname'>Username:</label>
          <input id='uname' type="text" placeholder="username*" required
            value={this.state.input} onChange={this.handleChange} />
        </div>

        <input type="submit" value="Create User" />

        {
          this.props.userInfo &&
          <div class='code-block-container'>
            <JSONObjectCodeBlock object={this.props.userInfo} />
          </div>
        }
      </form>
    );
  }
}

/*
 * Connect form to the Redux store.
 */

const ConnectedUserForm = ReactRedux.connect(
  state => ({
    userInfo: state.userInfo
  }),
  dispatch => ({
    dispatchCreateUser: username => dispatch(createUserAsync(username))
  })
)(CreateUserForm);

/*
 * Export wrapped component.
 */

export default (
  <ReactRedux.Provider store={store}>
    <ConnectedUserForm />
  </ReactRedux.Provider>
);
