
import React from 'react';
import { connect } from 'react-redux';
import { createUserAsync } from '../redux/actions';
import { JSONObjectCodeBlock } from './JSONDisplays';

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
    let userInfo = null;
    if (this.props.processingRequest) {
      userInfo = (
        <div className='code-block-container'>
          <p className='code-block'><code>Creating user...</code></p>
        </div>
      );
    }
    else if (this.props.userInfo) {
      userInfo = (
        <div className='code-block-container'>
          <JSONObjectCodeBlock object={this.props.userInfo} />
        </div>
      );
    }

    return (
      <form onSubmit={this.createUser}>
        <h2>Create a New User</h2>
        <p><code className='code-inline'>POST /api/exercise/new-user</code></p>

        <div className='input-container'>
          <label htmlFor='uname'>Username:</label>
          <input id='uname' type="text" placeholder="username*" required
            value={this.state.input} onChange={this.handleChange} />
        </div>
        <input type="submit" value="Create User" />

        {userInfo}

      </form>
    );
  }
}

/*
 * Connect form to the Redux store.
 */

const ConnectedCreateUserForm = connect(
  state => ({
    processingRequest: state.userInfo.processingRequest,
    userInfo: state.userInfo.receivedData
  }),
  dispatch => ({
    dispatchCreateUser: username => dispatch(createUserAsync(username))
  })
)(CreateUserForm);

export default ConnectedCreateUserForm;
