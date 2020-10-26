'use strict';

/*
 * Redux action creators, reducers and the store.
 */

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

const REQ_CREATE_USER = 'REQUESTED_CREATE_USER';
const REC_CREATE_USER = 'RECEIVED_CREATE_USER';

const reqCreateUser = () => ({
  type: REQ_CREATE_USER
});

const recCreateUser = userInfo => ({
  type: REC_CREATE_USER,
  userInfo
});

const createUserAsync = username => dispatch => {
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
 * Reducer for creating new users.
 *
 * The state is an object representing user info or an error.
 */

const createUserReducer = (state = null, action) => {
  switch(action.type) {
    case REQ_CREATE_USER:
      return state;
    case REC_CREATE_USER:
      return action.userInfo;
    default:
      return state;
  }
};

/*
 * Async action creator for adding an exercise.
 */

const REQ_ADD_EXERCISE = 'REQUESTED_ADD_EXERCISE';
const REC_ADD_EXERCISE = 'RECEIVED_ADD_EXERCISE';

const reqAddExercise = () => ({
  type: REQ_ADD_EXERCISE
});

const recAddExercise = exerciseInfo => ({
  type: REC_ADD_EXERCISE,
  exerciseInfo
});

const addExerciseAsync = (
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
 * Reducer for adding exercises.
 *
 * The state is an object representing exercise info.
 */

const addExerciseReducer = (state = null, action) => {
  switch (action.type) {
    case REQ_ADD_EXERCISE:
      return state;
    case REC_ADD_EXERCISE:
      return action.exerciseInfo;
    default:
      return state;
  }
};

/*
 * Async action creator for getting all users.
 */

const REC_GET_USERS = 'RECEIVED_GET_USERS';

const recGetUsers = allUsersArray => ({
  type: REC_GET_USERS,
  allUsersArray
});

const getUsersAsync = () => dispatch => fetch('/api/exercise/users')
  .then(res => processResponse(res, dispatch, recGetUsers))
  .catch(err => console.error(err));

/*
 * Reducer for getting all users.
 *
 * The state is an array with user info.
 */

const getUsersReducer = (state = null, action) => {
  switch (action.type) {
    case REC_GET_USERS:
      return action.allUsersArray;
    default:
      return state;
  }
};

/*
 * Async action creator for getting a user's exercise log.
 */

const REC_GET_EXERCISES = 'RECEIVED_GET_EXERCISES';

const recGetExercises = exerciseLog => ({
  type: REC_GET_EXERCISES,
  exerciseLog
});

const getExercisesAsync = (userId, from, to, limit) => dispatch => {
  const params = new URLSearchParams({ userId });

  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (limit) params.append('limit', limit);

  fetch('/api/exercise/log?' + params.toString())
    .then(res => processResponse(res, dispatch, recGetExercises))
    .catch(err => console.error(err));
};

/*
 * Reducer for getting a user's exercise log.
 *
 * The state is an object with user info and the exercise log.
 */

const getExercisesReducer = (state = null, action) => {
  switch (action.type) {
    case REC_GET_EXERCISES:
      return action.exerciseLog;
    default:
      return state;
  }
};

/*
 * Combined reducer and the store.
 */

const rootReducer = Redux.combineReducers({
  userInfo: createUserReducer,
  exerciseInfo: addExerciseReducer,
  allUsersArray: getUsersReducer,
  exerciseLog: getExercisesReducer
});

const store = Redux.createStore(
  rootReducer,
  Redux.applyMiddleware(ReduxThunk.default)
);

store.subscribe(() => console.log(store.getState()));

/*
 * Export action creators and the store.
 */

export {
  createUserAsync, addExerciseAsync, getUsersAsync, getExercisesAsync, store
};
