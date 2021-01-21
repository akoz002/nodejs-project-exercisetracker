
import React from 'react';
import { connect } from 'react-redux';
import { getUsersAsync } from '../redux/actions';
import { JSONArrayCodeBlock } from './JSONDisplays';

/*
 * Form to get all users.
 */

const GetUsersForm = ({
  processingRequest, allUsersArray, dispatchGetUsers
}) => {
  let allUsersInfo = null;
  if (processingRequest) {
    allUsersInfo = (
      <div className='code-block-container'>
        <p className='code-block'><code>Getting users...</code></p>
      </div>
    );
  }
  else if (allUsersArray) {
    allUsersInfo = (
      <div className='code-block-container'>
        <JSONArrayCodeBlock array={allUsersArray} />
      </div>
    );
  }

  return (
    <form onSubmit={event => {
      event.preventDefault();
      dispatchGetUsers();
    }}>
      <h2>Get All Users</h2>
      <p><code className='code-inline'>GET /api/exercise/users</code></p>
      <input type="submit" value="Get All Users" />
      {allUsersInfo}
    </form>
  );
};

/*
 * Connect component to the Redux store.
 */

const ConnectedGetUsersForm = connect(
  state => ({
    processingRequest: state.allUsersArray.processingRequest,
    allUsersArray: state.allUsersArray.receivedData
  }),
  dispatch => ({
    dispatchGetUsers: () => dispatch(getUsersAsync())
  })
)(GetUsersForm);

export default ConnectedGetUsersForm;
