/*
 * Basic tests for the Exercise Tracker Microservice.
 * Alex Kozlov, 2020
 */

const assert = require('assert');
const axios = require('axios');
const queryString = require('querystring');
require('dotenv').config();

/*
 * Validate creating a user.
 */

const validateCreateUser = (username, duplicate = false) => axios.post(
  process.env.APP_URL + 'new-user',
  queryString.stringify({ username })
)
.then(res => {
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.data.username, username);
  assert.ok(res.data._id);
  console.log("Successfully validated creating new user '%s'", res.data.username);
  return res.data._id;
})
.catch(err => {
  if (duplicate) {
    assert.strictEqual(err.response.status, 400);
    assert.strictEqual(err.response.data, 'Username already exists in the database');
    console.log('Successfully validated trying to create a duplicate username');
  }
  else { // unexpected error
    console.error('Test encountered unexpected error:');
    assert.fail(err);
  }
});

/*
 * Validate adding an exercise to a user.
 */

const validateAddExercise = (
  userId, { description, duration, date }, invalidUserId = false
) => axios.post(
  process.env.APP_URL + 'add',
  queryString.stringify({ userId, description, duration, date })
)
.then(res => {
  assert.strictEqual(res.status, 201);
  assert.ok(res.data.username);
  assert.strictEqual(res.data._id, userId);
  assert.strictEqual(res.data.description, description);
  assert.strictEqual(res.data.duration, duration);
  assert.ok(!isNaN(Date.parse(res.data.date)),
    `Response date '${res.data.date}' is invalid`);

  console.log("Successfully validated adding exercise: \n'%o'", res.data);

  // return the validated response date
  return res.data.date;
})
.catch(err => {
  if (!userId) { // no userId was provided
    assert.strictEqual(err.response.status, 400);
    assert.strictEqual(err.response.data, "Form data 'userId' is required to add an exercise");
    console.log('Successfully validated trying to add exercise without userId');
  }
  else if (invalidUserId) { // provided userId is invalid
    assert.strictEqual(err.response.status, 404);
    assert.strictEqual(err.response.data, `userId '${userId}' does not exist in the database`);
    console.log('Successfully validated trying to add exercise with invalid userId');
  }
  else { // unexpected error
    console.error('Test encountered unexpected error:');
    assert.fail(err);
  }
});

/*
 * Validate deleting a user.
 */

const validateDeleteUser = (
  username, validateSuccess = true, validateFailure = false
) => axios({
  url: process.env.APP_URL + 'delete-user',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: queryString.stringify({ username })
})
.then(res => {
  if (validateSuccess) {
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data, `Successfully deleted user '${username}'`);
    console.log("Successfully validated deleting user '%s'", username);
  }
})
.catch(err => {
  if (validateFailure) {
    assert.strictEqual(err.response.status, 404);
    assert.strictEqual(err.response.data, `No user '${username}' exists in the database`);
    console.log("Successfully validated deleting non-existent user '%s'", username);
  }
});

/*
 * Validate getting all users.
 */

const validateGetUsers = () => axios.get(
  process.env.APP_URL + 'users'
)
.then(res => {
  assert.strictEqual(res.status, 200);
  testUsers.forEach(testUser => assert.ok(
    res.data.some(responseUser => (
      responseUser.username === testUser.username &&
      responseUser._id === testUser._id
    )),
    `Test user '${testUser.username}' (ID '${testUser._id}') not found ` +
    'when getting all users'
  ));
  console.log('Successfully validated getting all users');
});

/*
 * Validate getting a user's exercise log.
 */

const validateExerciseLog = (
  expectedUser, from, to, limit, expectedLog, invalidUserId = false
) => axios.get(
  process.env.APP_URL + 'log',
  { params: { userId: expectedUser._id, from, to, limit }}
)
.then(res => {
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.username, expectedUser.username);
  assert.strictEqual(res.data._id, expectedUser._id);
  assert.strictEqual(res.data.log.length, expectedLog.length);
  assert.strictEqual(res.data.count, expectedLog.length);

  for (const i in expectedLog) {
    assert.deepStrictEqual(res.data.log[i], expectedLog[i]);
  }

  console.log(`Successfully validated log for user '${expectedUser.username}' ` +
    `(from '${from}', to '${to}', limit '${limit}')`);
})
.catch(err => {
  if (!expectedUser._id) { // no userId was provided
    assert.strictEqual(err.response.status, 400);
    assert.strictEqual(err.response.data, "Query parameter 'userId' is required to retrieve a log");
    console.log('Successfully validated trying to get a log without userId');
  }
  else if (invalidUserId) { // provided userId is invalid
    assert.strictEqual(err.response.status, 404);
    assert.strictEqual(err.response.data, `userId '${expectedUser._id}' does not exist in the database`);
    console.log('Successfully validated trying to get a log with invalid userId');
  }
  else { // unexpected error
    console.error('Test encountered unexpected error:');
    assert.fail(err);
  }
});

/*
 * Define test users and exercises.
 */

const testUsers = [
  {
    username: 'Bob',
    log: [
      { description: 'Beer', duration: 90, date: '1969-01-01' },
      { description: 'Pizza', duration: 60, date: '1973-02-03' },
      { description: 'Donuts', duration: 30, date: '1977-12-25' },
      { description: 'Burgers', duration: 40, date: undefined }
    ]
  },
  {
    username: 'Jim',
    log: [
      { description: 'Iron Maiden', duration: 160, date: '1981-04-05' },
      { description: 'Accept', duration: 100, date: '1984-07-07' },
      { description: 'Judas Priest', duration: 120, date: '1990-10-11' },
      { description: 'Blind Guardian', duration: 130, date: '' }
    ]
  }
];

/*
 * Adds and validates test users and exercises.
 */

async function addAndValidateUsers() {
  for (const user of testUsers) {
    // ensure user does not exist already
    await validateDeleteUser(user.username, false, false);

    // add the user and store the id
    user._id = await validateCreateUser(user.username);

    // add the exercises
    for (const exercise of user.log) {
      // store the response date for later validation
      exercise.date = await validateAddExercise(user._id, exercise);
    }
  }
}

/*
 * Validates getting logs with different parameters.
 */

async function validateGetLogs() {
  const userBob = testUsers[0];
  const userJim = testUsers[1];

  // full log
  await validateExerciseLog(userBob, null, null, null, userBob.log);

  // partial logs with dates
  await validateExerciseLog(userJim, '1988-10-10', null, null, userJim.log.slice(2));
  await validateExerciseLog(userJim, null, '1996-11-23', null, userJim.log.slice(0, 3));
  await validateExerciseLog(userJim, '1984-07-07', '1990-10-11', null, userJim.log.slice(1, 3));

  // partial logs with limits
  await validateExerciseLog(userBob, null, null, 3, userBob.log.slice(0, 3));
  await validateExerciseLog(userBob, null, '2000-01-01', 2, userBob.log.slice(0, 2));
  await validateExerciseLog(userBob, '1969-01-02', '1999-12-25', 1, userBob.log.slice(1, 2));
}

/*
 * Validate various error cases.
 */

async function validateErrorCases() {
  const userBob = testUsers[0];
  const userJim = testUsers[1];

  // try to add a duplicate user
  await validateCreateUser(userBob.username, true);

  // delete the users
  await validateDeleteUser(userBob.username);
  await validateDeleteUser(userBob.username, false, true);
  await validateDeleteUser(userJim.username);
  await validateDeleteUser(userJim.username, false, true);

  // add exercise without userId
  await validateAddExercise(null, userBob.log[0]);

  // add exercise with invalid userId
  await validateAddExercise(userBob._id, userBob.log[0], true);

  // get log without userId
  await validateExerciseLog({});

  // get log with invalid userId
  await validateExerciseLog(userBob, null, null, null, null, true);
}

/*
 * Run basic tests.
 */

async function runTests() {
  console.log(`Running tests on app URL: '${process.env.APP_URL}'\n`);

  // add users and exercises
  await addAndValidateUsers();

  // validate getting all users
  await validateGetUsers();

  // validate getting logs with different parameters
  await validateGetLogs();

  // validate error cases
  await validateErrorCases();
}

runTests();
