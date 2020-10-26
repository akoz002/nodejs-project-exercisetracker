'use strict';
/*
 * Imports and renders React components.
 */

import CreateUserForm from './components/createUserForm.js';
import AddExerciseForm from './components/addExerciseForm.js';
import GetUsersForm from './components/getUsersForm.js';
import GetExercisesForm from './components/getExercisesForm.js';
ReactDOM.render(CreateUserForm, document.querySelector('#create-user-form'));
ReactDOM.render(AddExerciseForm, document.querySelector('#add-exercise-form'));
ReactDOM.render(GetUsersForm, document.querySelector('#get-users-form'));
ReactDOM.render(GetExercisesForm, document.querySelector('#get-exercises-form'));