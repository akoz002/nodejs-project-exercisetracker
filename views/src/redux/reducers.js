
import { combineReducers } from 'redux';
import {
  REQ_CREATE_USER,
  REC_CREATE_USER,
  REQ_ADD_EXERCISE,
  REC_ADD_EXERCISE,
  REQ_GET_USERS,
  REC_GET_USERS,
  REQ_GET_EXERCISES,
  REC_GET_EXERCISES
} from './actions';

/*
 * Reducer for creating new users.
 */

const createUserReducer = (state = {
  processingRequest: false,
  receivedData: null
}, action) => {
  switch(action.type) {
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
 * Export the combined reducer.
 */

const rootReducer = combineReducers({
  userInfo: createUserReducer,
  exerciseInfo: addExerciseReducer,
  allUsersArray: getUsersReducer,
  exerciseLog: getExercisesReducer
});

export default rootReducer;
