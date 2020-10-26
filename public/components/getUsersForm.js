'use strict';

import { getUsersAsync, store } from './redux.js';
import { JSONArrayCodeBlock } from './jsonDisplays.js';
/*
 * Form to get all users.
 */

const GetUsersForm = ({
  allUsersArray,
  dispatchGetUsers
}) => /*#__PURE__*/React.createElement("form", {
  onSubmit: event => {
    event.preventDefault();
    dispatchGetUsers();
  }
}, /*#__PURE__*/React.createElement("h2", null, "Get All Users"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", {
  className: "code-inline"
}, "GET /api/exercise/users")), /*#__PURE__*/React.createElement("input", {
  type: "submit",
  value: "Get All Users"
}), allUsersArray && /*#__PURE__*/React.createElement("div", {
  class: "code-block-container"
}, /*#__PURE__*/React.createElement(JSONArrayCodeBlock, {
  array: allUsersArray
})));
/*
 * Connect component to the Redux store.
 */


const ConnectedUsersForm = ReactRedux.connect(state => ({
  allUsersArray: state.allUsersArray
}), dispatch => ({
  dispatchGetUsers: () => dispatch(getUsersAsync())
}))(GetUsersForm);
/*
 * Export wrapped component.
 */

export default /*#__PURE__*/React.createElement(ReactRedux.Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ConnectedUsersForm, null));