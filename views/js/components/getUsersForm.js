'use strict';

import { getUsersAsync, store } from './redux.js';
import { JSONArrayCodeBlock } from './jsonDisplays.js';

/*
 * Form to get all users.
 */

const GetUsersForm = ({ allUsersArray, dispatchGetUsers }) => (
  <form onSubmit={event => {
    event.preventDefault();
    dispatchGetUsers();
  }}>
    <h2>Get All Users</h2>
    <p><code className='code-inline'>GET /api/exercise/users</code></p>
    <input type="submit" value="Get All Users" />
    {
      allUsersArray &&
      <div class='code-block-container'>
        <JSONArrayCodeBlock array={allUsersArray} />
      </div>
    }
  </form>
);

/*
 * Connect component to the Redux store.
 */

const ConnectedUsersForm = ReactRedux.connect(
  state => ({
    allUsersArray: state.allUsersArray
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
