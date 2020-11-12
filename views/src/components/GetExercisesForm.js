
import React from 'react';
import { connect } from 'react-redux';
import { getExercisesAsync } from '../redux/actions';
import { JSONObjectCodeBlock } from './JSONDisplays';

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
  }

  // 'onChange' handler
  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }

  // 'onSubmit' handler
  getExerciseLog(e) {
    e.preventDefault();

    this.props.dispatchGetExercises(
      this.state.userId,
      this.state.from,
      this.state.to,
      this.state.limit
    );

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
      exerciseLog = (
        <div className='code-block-container'>
          <p className='code-block'><code>Getting exercises...</code></p>
        </div>
      );
    }
    else if (this.props.exerciseLog) {
      exerciseLog = (
        <div className='code-block-container'>
          <JSONObjectCodeBlock object={this.props.exerciseLog} />
        </div>
      );
    }

    return (
      <form onSubmit={this.getExerciseLog}>
        <h2>Get a User's Exercise Log</h2>
        <p><code className='code-inline'>
          GET /api/exercise/log?{'{userId}'}[&amp;from][&amp;to][&amp;limit]
        </code></p>

        <div className='input-container'>
          <label for='get-uid'>UserID:</label>
          <input id='get-uid' name='userId' type="text" placeholder="userId*"
            required value={this.state.userId} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label for='from'>From:</label>
          <input id='from' name='from' type="date"
            value={this.state.from} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label for='to'>To:</label>
          <input id='to' name='to' type="date"
            value={this.state.to} onChange={this.handleChange} />
        </div>

        <div className='input-container'>
          <label for='limit'>Limit:</label>
          <input id='limit' name='limit' type="number" placeholder="No. of entries"
            value={this.state.limit} onChange={this.handleChange} />
        </div>

        <input type="submit" value="Get Exercise Log" />

        {exerciseLog}

      </form>
    );
  }
}

/*
 * Connect component to the Redux store.
 */

const ConnectedGetExercisesForm = connect(
  state => ({
    processingRequest: state.exerciseLog.processingRequest,
    exerciseLog: state.exerciseLog.receivedData
  }),
  dispatch => ({
    dispatchGetExercises: (userId, from, to, limit) =>
      dispatch(getExercisesAsync(userId, from, to, limit))
  })
)(GetExercisesForm);

export default ConnectedGetExercisesForm;
