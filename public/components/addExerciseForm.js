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
    this.handleChange = this.handleChange.bind(this);
    this.addExercise = this.addExercise.bind(this);
  } // 'onChange' handler


  handleChange({
    target
  }) {
    this.setState({
      [target.name]: target.value
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
      name: "userId",
      type: "text",
      placeholder: "userId*",
      required: true,
      value: this.state.userId,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "desc"
    }, "Description:"), /*#__PURE__*/React.createElement("input", {
      id: "desc",
      name: "description",
      type: "text",
      placeholder: "description*",
      required: true,
      value: this.state.description,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "dur"
    }, "Duration:"), /*#__PURE__*/React.createElement("input", {
      id: "dur",
      name: "duration",
      type: "number",
      placeholder: "duration* (mins.)",
      required: true,
      value: this.state.duration,
      onChange: this.handleChange
    })), /*#__PURE__*/React.createElement("div", {
      className: "input-container"
    }, /*#__PURE__*/React.createElement("label", {
      for: "date"
    }, "Date:"), /*#__PURE__*/React.createElement("input", {
      id: "date",
      name: "date",
      type: "date",
      value: this.state.date,
      onChange: this.handleChange
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