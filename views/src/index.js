
'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import CreateUserForm from './components/CreateUserForm';
import AddExerciseForm from './components/AddExerciseForm';
import GetUsersForm from './components/GetUsersForm';
import GetExercisesForm from './components/GetExercisesForm';

/*
 * Create the redux store and render the React components.
 */

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk)
);

render(
  <Provider store={store}>
    <CreateUserForm />
  </Provider>,
  document.querySelector('#create-user-form')
);

render(
  <Provider store={store}>
    <AddExerciseForm />
  </Provider>,
  document.querySelector('#add-exercise-form')
);

render(
  <Provider store={store}>
    <GetUsersForm />
  </Provider>,
  document.querySelector('#get-users-form')
);

render(
  <Provider store={store}>
    <GetExercisesForm />
  </Provider>,
  document.querySelector('#get-exercises-form')
);
