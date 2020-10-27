'use strict';

import { addExerciseAsync, store } from './redux.js';
import { JSONObjectCodeBlock } from './jsonDisplays.js';
/*
 * Form to add an exercise.
 */

class AddExerciseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      description: '',
      duration: '',
      date: ''
    };
    this.handleUserId = this.handleUserId.bind(this);
    this.handleDesc = this.handleDesc.bind(this);
    this.handleDur = this.handleDur.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.addExercise = this.addExercise.bind(this);
  } // 'onChange' handlers for the input fields


  handleUserId(e) {
    this.setState({
      userId: e.target.value
    });
  }

  handleDesc(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleDur(e) {
    this.setState({
      duration: e.target.value
    });
  }

  handleDate(e) {
    this.setState({
      date: e.target.value
    });
  } // 'onSubmit' handler


  addExercise(e) {
    e.preventDefault(); // dispatch action to add exercise

    this.props.dispatchAddExercise(this.state.userId, this.state.description, this.state.duration, this.state.date);
    this.setState({
      userId: '',
      description: '',
      duration: '',
      date: ''
    });
  }

  render() {
    let exerciseInfo = null;

    if (this.props.processingRequest) {
      exerciseInfo = /*#__PURE__*/React.createElement("div", {
        className: "code-block-container"
      }, /*#__PURE__*/React.createElement("p", {
        className: "code-block"
      }, /*#__PURE__*/React.createElement("code", null, "Adding exercise...")));
    } else if (this.props.exerciseInfo) {
      exerciseInfo = /*#__PURE__*/React.createElement("div", {
        className: "code-block-container"
      }, /*#__PURE__*/React.createElement(JSONObjectCodeBlock, {
        object: this.props.exerciseInfo
      }));
    }

    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.addExercise
    }, /*#__PURE__*/React.createElement("h2", null, "Add a New Exercise"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("code", {
      className: "code-inline"
    }, "POST /api/exercise/add")), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "add-uid"
    }, "UserID:"), /*#__PURE__*/React.createElement("input", {
      id: "add-uid",
      type: "text",
      placeholder: "userId*",
      required: true,
      value: this.state.userId,
      onChange: this.handleUserId
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "desc"
    }, "Description:"), /*#__PURE__*/React.createElement("input", {
      id: "desc",
      type: "text",
      placeholder: "description*",
      required: true,
      value: this.state.description,
      onChange: this.handleDesc
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "dur"
    }, "Duration:"), /*#__PURE__*/React.createElement("input", {
      id: "dur",
      type: "number",
      placeholder: "duration* (mins.)",
      required: true,
      value: this.state.duration,
      onChange: this.handleDur
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "date"
    }, "Date:"), /*#__PURE__*/React.createElement("input", {
      id: "date",
      type: "date",
      value: this.state.date,
      onChange: this.handleDate
    })), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Add Exercise"
    }), exerciseInfo);
  }

}
/*
 * Connect component to the Redux store.
 */


const ConnectedAddExerciseForm = ReactRedux.connect(state => ({
  processingRequest: state.exerciseInfo.processingRequest,
  exerciseInfo: state.exerciseInfo.receivedData
}), dispatch => ({
  dispatchAddExercise: (userId, description, duration, date) => dispatch(addExerciseAsync(userId, description, duration, date))
}))(AddExerciseForm);
/*
 * Export wrapped component.
 */

export default /*#__PURE__*/React.createElement(ReactRedux.Provider, {
  store: store
}, /*#__PURE__*/React.createElement(ConnectedAddExerciseForm, null));