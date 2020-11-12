
/*
 * Helper to process response and dispatch action with payload.
 */

const processResponse = (
  res, dispatch, actionCreator, expectedStatus = 200
) => {
  if (res.status === expectedStatus) {
    // dispatch action with JSON data from the response
    res.json().then(json => dispatch(actionCreator(json)));
  }
  else {
    // dispatch action with an error object
    res.text().then(errorMessage => dispatch(actionCreator({
      status: res.status,
      statusText: res.statusText,
      errorMessage
    })));
  }
};

/*
 * Async action creator for creating a new user.
 */

export const REQ_CREATE_USER = 'REQUESTED_CREATE_USER';
export const REC_CREATE_USER = 'RECEIVED_CREATE_USER';

const reqCreateUser = () => ({
  type: REQ_CREATE_USER
});

const recCreateUser = userInfo => ({
  type: REC_CREATE_USER,
  userInfo
});

export const createUserAsync = username => dispatch => {
  // dispatch request action
  dispatch(reqCreateUser());

  // send request to create user
  fetch("/api/exercise/new-user", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ username })
  })
  .then(res => processResponse(res, dispatch, recCreateUser, 201))
  .catch(err => console.error(err));
};

/*
 * Async action creator for adding an exercise.
 */

export const REQ_ADD_EXERCISE = 'REQUESTED_ADD_EXERCISE';
export const REC_ADD_EXERCISE = 'RECEIVED_ADD_EXERCISE';

const reqAddExercise = () => ({
  type: REQ_ADD_EXERCISE
});

const recAddExercise = exerciseInfo => ({
  type: REC_ADD_EXERCISE,
  exerciseInfo
});

export const addExerciseAsync = (
  userId, description, duration, date
) => dispatch => {
  // dispatch request action
  dispatch(reqAddExercise());

  // send request to add exercise
  fetch("/api/exercise/add", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ userId, description, duration, date })
  })
  .then(res => processResponse(res, dispatch, recAddExercise, 201))
  .catch(err => console.error(err));
};

/*
 * Async action creator for getting all users.
 */

export const REQ_GET_USERS = 'REQUESTED_GET_USERS';
export const REC_GET_USERS = 'RECEIVED_GET_USERS';

const reqGetUsers = () => ({
  type: REQ_GET_USERS
});

const recGetUsers = allUsersArray => ({
  type: REC_GET_USERS,
  allUsersArray
});

export const getUsersAsync = () => dispatch => {
  dispatch(reqGetUsers());

  fetch('/api/exercise/users')
    .then(res => processResponse(res, dispatch, recGetUsers))
    .catch(err => console.error(err));
};

/*
 * Async action creator for getting a user's exercise log.
 */

export const REQ_GET_EXERCISES = 'REQUESTED_GET_EXERCISES';
export const REC_GET_EXERCISES = 'RECEIVED_GET_EXERCISES';

const reqGetExercises = () => ({
  type: REQ_GET_EXERCISES
});

const recGetExercises = exerciseLog => ({
  type: REC_GET_EXERCISES,
  exerciseLog
});

export const getExercisesAsync = (userId, from, to, limit) => dispatch => {
  dispatch(reqGetExercises());

  const params = new URLSearchParams({ userId });

  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (limit) params.append('limit', limit);

  fetch('/api/exercise/log?' + params.toString())
    .then(res => processResponse(res, dispatch, recGetExercises))
    .catch(err => console.error(err));
};
