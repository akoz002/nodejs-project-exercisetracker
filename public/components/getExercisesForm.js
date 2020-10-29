'use strict';

import { getExercisesAsync, store } from './redux.js';
import { JSONObjectCodeBlock } from './jsonDisplays.js';
/*
 * Form to get a user's exercise log.
 */

class GetExercisesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      from: '',
      to: '',
      limit: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getExerciseLog = this.getExerciseLog.bind(this);
  } // 'onChange' handler


  handleChange({
    target
  }) {
    this.setState({
      [target.name]: target.value
    });
  } // 'onSubmit' handler


  getExerciseLog(e) {
    e.preventDefault();
    this.props.dispatchGetExercises(this.state.userId, this.state.from, this.state.to, this.state.limit);
    this.setState({
      userId: '',
      from: '',
      to: '',
      limit: ''
    });
  }

  render() {
    let exerciseLog = null;

    if (this.props.processingRequest) {
      exerciseLog = /*#__PURE__*/React.createElement("div", {
        className: "code-block-container"
      }, /*#__PURE__*/React.createElement("p", {
        className: "code-block"
      }, /*#__PURE__*/React.createElement("code", null, "Getting exercises...")));
    } else if (this.props.exerciseLog) {
      exerciseLog = /*#__PURE__*/React.createElement("div", {
        className: "code-block-container"
      }, /*#__PURE__*/React.createElement(JSONObjectCodeBlock, {
        object: this.props.exerciseLog
      }));
    }

    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.getExerciseLog
    }, /*#__PURE__*/React.createElement("h2", null, "Get a User's Exercise Log"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", {
      className: "code-inline"
    }, "GET /api/exercise/log?", '{userId}', "[&from][&to][&limit]")), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "get-uid"
    }, "UserID:"), /*#__PURE__*/React.createElement("input", {
      id: "get-uid",
      name: "userId",
      type: "text",
      placeholder: "userId*",
      required: true,
      value: this.state.userId,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "from"
    }, "From:"), /*#__PURE__*/React.createElement("input", {
      id: "from",
      name: "from",
      type: "date",
      value: this.state.from,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "to"
    }, "To:"), /*#__PURE__*/React.createElement("input", {
      id: "to",
      name: "to",
      type: "date",
      value: this.state.to,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "limit"
    }, "Limit:"), /*#__PURE__*/React.createElement("input", {
      id: "limit",
      name: "limit",
      type: "number",
      placeholder: "No. of entries",
      value: this.state.limit,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Get Exercise Log"
    }), exerciseLog);
  }

}
/*
 * Connect component to the Redux store.
 */


const ConnectedGetExercisesForm = ReactRedux.connect(state => ({
  processingRequest: state.exerciseLog.processingRequest,
  exerciseLog: state.exerciseLog.receivedData
}), dispatch => ({
  dispatchGetExercises: (userId, from, to, limit) => dispatch(getExercisesAsync(userId, from, to, limit))
}))(GetExercisesForm);
/*
 * Export wrapped component.
 */

export default /*#__PURE__*/React.createElement(ReactRedux.Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ConnectedGetExercisesForm, null));