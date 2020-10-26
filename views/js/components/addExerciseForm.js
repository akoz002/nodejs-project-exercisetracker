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
  }

  // 'onChange' handlers for the input fields
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
  }

  // 'onSubmit' handler
  addExercise(e) {
    e.preventDefault();

    // dispatch action to add exercise
    this.props.dispatchAddExercise(
      this.state.userId,
      this.state.description,
      this.state.duration,
      this.state.date
    );

    this.setState({
      userId: '',
      description: '',
      duration: '',
      date: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.addExercise}>
        <h2>Add a New Exercise</h2>
        <p><code className='code-inline'>POST /api/exercise/add</code></p>

        <div class='input-container'>
          <label for='add-uid'>UserID:</label>
          <input id='add-uid' type="text" placeholder="userId*" required
            value={this.state.userId} onChange={this.handleUserId} />
        </div>

        <div class='input-container'>
          <label for='desc'>Description:</label>
          <input id='desc' type="text" placeholder="description*" required
            value={this.state.description} onChange={this.handleDesc} />
        </div>

        <div class='input-container'>
          <label for='dur'>Duration:</label>
          <input id='dur' type="number" placeholder="duration* (mins.)" required
            value={this.state.duration} onChange={this.handleDur} />
        </div>

        <div class='input-container'>
          <label for='date'>Date:</label>
          <input id='date' type="date"
            value={this.state.date} onChange={this.handleDate} />
        </div>

        <input type="submit" value="Add Exercise" />

        {
          this.props.exerciseInfo &&
          <div class='code-block-container'>
            <JSONObjectCodeBlock object={this.props.exerciseInfo} />
          </div>
        }
      </form>
    );
  }
}

/*
 * Connect component to the Redux store.
 */

const ConnectedAddExerciseForm = ReactRedux.connect(
  state => ({
    exerciseInfo: state.exerciseInfo
  }),
  dispatch => ({
    dispatchAddExercise: (userId, description, duration, date) =>
      dispatch(addExerciseAsync(userId, description, duration, date))
  })
)(AddExerciseForm);

/*
 * Export wrapped component.
 */

export default (
  <ReactRedux.Provider store={store}>
    <ConnectedAddExerciseForm />
  </ReactRedux.Provider>
);
