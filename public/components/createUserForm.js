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
  } // input 'onChange' handler


  handleChange(e) {
    this.setState({
      input: e.target.value
    });
  } // button 'onSubmit' handler


  createUser(e) {
    e.preventDefault(); // dispatch async action to create a new user

    this.props.dispatchCreateUser(this.state.input);
    this.setState({
      input: ''
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.createUser
    }, /*#__PURE__*/React.createElement("h2", null, "Create a New User"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", {
      className: "code-inline"
    }, "POST /api/exercise/new-user")), /*#__PURE__*/React.createElement("div", {
      class: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "uname"
    }, "Username:"), /*#__PURE__*/React.createElement("input", {
      id: "uname",
      type: "text",
      placeholder: "username*",
      required: true,
      value: this.state.input,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Create User"
    }), this.props.userInfo && /*#__PURE__*/React.createElement("div", {
      class: "code-block-container"
    }, /*#__PURE__*/React.createElement(JSONObjectCodeBlock, {
      object: this.props.userInfo
    })));
  }

}
/*
 * Connect form to the Redux store.
 */


const ConnectedUserForm = ReactRedux.connect(state => ({
  userInfo: state.userInfo
}), dispatch => ({
  dispatchCreateUser: username => dispatch(createUserAsync(username))
}))(CreateUserForm);
/*
 * Export wrapped component.
 */

export default /*#__PURE__*/React.createElement(ReactRedux.Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ConnectedUserForm, null));