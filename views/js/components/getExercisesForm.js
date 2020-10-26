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

    this.handleUserId = this.handleUserId.bind(this);
    this.handleFrom = this.handleFrom.bind(this);
    this.handleTo = this.handleTo.bind(this);
    this.handleLimit = this.handleLimit.bind(this);
    this.getExerciseLog = this.getExerciseLog.bind(this);
  }

  // 'onChange' handlers for input fields
  handleUserId(e) {
    this.setState({
      userId: e.target.value
    });
  }

  handleFrom(e) {
    this.setState({
      from: e.target.value
    });
  }

  handleTo(e) {
    this.setState({
      to: e.target.value
    });
  }

  handleLimit(e) {
    this.setState({
      limit: e.target.value
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
    return (
      <form onSubmit={this.getExerciseLog}>
        <h2>Get a User's Exercise Log</h2>
        <p><code className='code-inline'>
          GET /api/exercise/log?{'{userId}'}[&amp;from][&amp;to][&amp;limit]
        </code></p>

        <div class='input-container'>
          <label for='get-uid'>UserID:</label>
          <input id='get-uid' type="text" placeholder="userId*" required
            value={this.state.userId} onChange={this.handleUserId} />
        </div>

        <div class='input-container'>
          <label for='from'>From:</label>
          <input id='from' type="date"
            value={this.state.from} onChange={this.handleFrom} />
        </div>

        <div class='input-container'>
          <label for='to'>To:</label>
          <input id='to' type="date"
            value={this.state.to} onChange={this.handleTo} />
        </div>

        <div class='input-container'>
          <label for='limit'>Limit:</label>
          <input id='limit' type="number" placeholder="No. of entries"
            value={this.state.limit} onChange={this.handleLimit} />
        </div>

        <input type="submit" value="Get Exercise Log" />

        {
          this.props.exerciseLog &&
          <div class='code-block-container'>
            <JSONObjectCodeBlock object={this.props.exerciseLog} />
          </div>
        }

      </form>
    );
  }
}

/*
 * Connect component to the Redux store.
 */

const ConnectedGetExercisesForm = ReactRedux.connect(
  state => ({
    exerciseLog: state.exerciseLog
  }),
  dispatch => ({
    dispatchGetExercises: (userId, from, to, limit) =>
      dispatch(getExercisesAsync(userId, from, to, limit))
  })
)(GetExercisesForm);

/*
 * Export wrapped component.
 */

export default (
  <ReactRedux.Provider store={store}>
    <ConnectedGetExercisesForm />
  </ReactRedux.Provider>
);
