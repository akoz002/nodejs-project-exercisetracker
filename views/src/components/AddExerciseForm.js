
import React from 'react';
import { connect } from 'react-redux';
import { addExerciseAsync } from '../redux/actions';
import { JSONObjectCodeBlock } from './JSONDisplays';

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
  }

  // 'onChange' handler
  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
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
    let exerciseInfo = null;
    if (this.props.processingRequest) {
      exerciseInfo = (
        <div className='code-block-container'>
          <p className='code-block'><code>Adding exercise...</code></p>
        </div>
      );
    }
    else if (this.props.exerciseInfo) {
      exerciseInfo = (
        <div className='code-block-container'>
          <JSONObjectCodeBlock object={this.props.exerciseInfo} />
        </div>
      );
    }

    return (
      <form onSubmit={this.addExercise}>
        <h2>Add a New Exercise</h2>
        <p><code className='code-inline'>POST /api/exercise/add</code></p>

        <div className='input-container'>
          <label htmlFor='add-uid'>UserID:</label>
          <input id='add-uid' name='userId' type="text" placeholder="userId*"
            required value={this.state.userId} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label htmlFor='desc'>Description:</label>
          <input id='desc' name='description' type="text" placeholder="description*"
            required value={this.state.description} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label htmlFor='dur'>Duration:</label>
          <input id='dur' name='duration' type="number" placeholder="duration* (mins.)"
            required value={this.state.duration} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label htmlFor='date'>Date:</label>
          <input id='date' name='date' type="date"
            value={this.state.date} onChange={this.handleChange} />
        </div>

        <input type="submit" value="Add Exercise" />

        {exerciseInfo}

      </form>
    );
  }
}

/*
 * Connect component to the Redux store.
 */

const ConnectedAddExerciseForm = connect(
  state => ({
    processingRequest: state.exerciseInfo.processingRequest,
    exerciseInfo: state.exerciseInfo.receivedData
  }),
  dispatch => ({
    dispatchAddExercise: (userId, description, duration, date) =>
      dispatch(addExerciseAsync(userId, description, duration, date))
  })
)(AddExerciseForm);

export default ConnectedAddExerciseForm;
