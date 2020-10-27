'use strict';
/*
 * Redux action creators, reducers and the store.
 */

/*
 * Helper to process response and dispatch action with payload.
 */

const processResponse = (res, dispatch, actionCreator, expectedStatus = 200) => {
  if (res.status === expectedStatus) {
    // dispatch action with JSON data from the response
    res.json().then(json => dispatch(actionCreator(json)));
  } else {
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
  dispatch(reqCreateUser()); // send request to create user

  fetch("/api/exercise/new-user", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      username
    })
  }).then(res => processResponse(res, dispatch, recCreateUser, 201)).catch(err => console.error(err));
};
/*
 * Reducer for creating new users.
 */


const createUserReducer = (state = {
  processingRequest: false,
  receivedData: null
}, action) => {
  switch (action.type) {
    case REQ_CREATE_USER:
      return {
        processingRequest: true,
        receivedData: null
      };

    case REC_CREATE_USER:
      return {
        processingRequest: false,
        receivedData: action.userInfo
      };

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

const addExerciseAsync = (userId, description, duration, date) => dispatch => {
  // dispatch request action
  dispatch(reqAddExercise()); // send request to add exercise

  fetch("/api/exercise/add", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      userId,
      description,
      duration,
      date
    })
  }).then(res => processResponse(res, dispatch, recAddExercise, 201)).catch(err => console.error(err));
};
/*
 * Reducer for adding exercises.
 */


const addExerciseReducer = (state = {
  processingRequest: false,
  receivedData: null
}, action) => {
  switch (action.type) {
    case REQ_ADD_EXERCISE:
      return {
        processingRequest: true,
        receivedData: null
      };

    case REC_ADD_EXERCISE:
      return {
        processingRequest: false,
        receivedData: action.exerciseInfo
      };

    default:
      return state;
  }
};
/*
 * Async action creator for getting all users.
 */


const REQ_GET_USERS = 'REQUESTED_GET_USERS';
const REC_GET_USERS = 'RECEIVED_GET_USERS';

const reqGetUsers = () => ({
  type: REQ_GET_USERS
});

const recGetUsers = allUsersArray => ({
  type: REC_GET_USERS,
  allUsersArray
});

const getUsersAsync = () => dispatch => {
  dispatch(reqGetUsers());
  fetch('/api/exercise/users').then(res => processResponse(res, dispatch, recGetUsers)).catch(err => console.error(err));
};
/*
 * Reducer for getting all users.
 */


const getUsersReducer = (state = {
  processingRequest: false,
  receivedData: null
}, action) => {
  switch (action.type) {
    case REQ_GET_USERS:
      return {
        processingRequest: true,
        receivedData: null
      };

    case REC_GET_USERS:
      return {
        processingRequest: false,
        receivedData: action.allUsersArray
      };

    default:
      return state;
  }
};
/*
 * Async action creator for getting a user's exercise log.
 */


const REQ_GET_EXERCISES = 'REQUESTED_GET_EXERCISES';
const REC_GET_EXERCISES = 'RECEIVED_GET_EXERCISES';

const reqGetExercises = () => ({
  type: REQ_GET_EXERCISES
});

const recGetExercises = exerciseLog => ({
  type: REC_GET_EXERCISES,
  exerciseLog
});

const getExercisesAsync = (userId, from, to, limit) => dispatch => {
  dispatch(reqGetExercises());
  const params = new URLSearchParams({
    userId
  });
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (limit) params.append('limit', limit);
  fetch('/api/exercise/log?' + params.toString()).then(res => processResponse(res, dispatch, recGetExercises)).catch(err => console.error(err));
};
/*
 * Reducer for getting a user's exercise log.
 */


const getExercisesReducer = (state = {
  processingRequest: false,
  receivedData: null
}, action) => {
  switch (action.type) {
    case REQ_GET_EXERCISES:
      return {
        processingRequest: true,
        receivedData: null
      };

    case REC_GET_EXERCISES:
      return {
        processingRequest: false,
        receivedData: action.exerciseLog
      };

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
const store = Redux.createStore(rootReducer, Redux.applyMiddleware(ReduxThunk.default));
store.subscribe(() => console.log(store.getState()));
/*
 * Export action creators and the store.
 */

export { createUserAsync, addExerciseAsync, getUsersAsync, getExercisesAsync, store };