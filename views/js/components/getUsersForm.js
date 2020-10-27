'use strict';

import { getUsersAsync, store } from './redux.js';
import { JSONArrayCodeBlock } from './jsonDisplays.js';

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
      <div class='code-block-container'>
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

const ConnectedUsersForm = ReactRedux.connect(
  state => ({
    processingRequest: state.allUsersArray.processingRequest,
    allUsersArray: state.allUsersArray.receivedData
  }),
  dispatch => ({
    dispatchGetUsers: () => dispatch(getUsersAsync())
  })
)(GetUsersForm);

/*
 * Export wrapped component.
 */

export default (
  <ReactRedux.Provider store={store}>
    <ConnectedUsersForm />
  </ReactRedux.Provider>
);
