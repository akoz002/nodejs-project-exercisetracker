# Exercise Tracker REST API Microservice

### User Stories

#### 1. Create a user

I can create a user by posting form data `username` to:
```
POST /api/exercise/new-user
```
and returned will be an object with: 
```
{ username: <username>, _id: <_id> }
```

#### 2. Get all users

I can get an array of *all* users by getting:
```
GET /api/exercise/users
```
with the same info returned as when creating a user, i.e.:
```
[
  { username: <username>, _id: <_id> },
  { username: <username>, _id: <_id> },
  ...
]
```

#### 3. Add an exercise

I can add an exercise to any user by posting form data `userId(_id)`, `description`, `duration` and optionally `date` to: 
```
POST /api/exercise/add
```
If no date is supplied it will use the current date. Returned will be the user object also with the exercise fields added:
```
{
  username: <username>, 
  _id: <_id>,
  description: <desc>,
  duration: <mins>,
  date: "Tue Aug 25 2020"
}
```

#### 4. Get full exercise log

I can retrieve a full exercise log of any user by getting:
```
GET /api/exercise/log?{userId}
```
with a parameter of `userId(_id)`. Returned will be the user object with the added array exercise log and count (total exercise count):
```
{ 
  username: <username>, 
  _id: <_id>,
  log: [
    { description: <desc>, duration: <mins>, date: <date> },
    { description: <desc>, duration: <mins>, date: <date> },
    ...
  ],
  count: <total exercise count>
}
```

#### 5. Get partial exercise log

I can retrieve a part of the log of any user by also passing along optional parameters of `from`, `to` or `limit` (date format = yyyy-mm-dd, limit = int):
```
GET /api/exercise/log?{userId}[&from][&to][&limit]
```

### Implementation

At the backend the app is implemented with *Node.js*, *Express* and *Mongoose/MongoDB*. The server source can be found in `server.js`. A demo can be found at the link below. At the frontend the home page has *React/Redux* web forms to create and get users and exercises. React/Redux source can be found at `views/src/`and it was built with *Parcel*. Source maps were generated and the original source can be viewed in browser developer tools.

* https://akoz002-nodejs-exercisetracker.herokuapp.com/

As explained above you can also send requests directly to:

`https://akoz002-nodejs-exercisetracker.herokuapp.com/api/exercise/<operation>`

#### Tests

A set of basic tests can be found at `tests/tests.js`. To execute the tests in a local environment, first start the server with `npm start`. Environment variable `DB_URI` is used by the app to locate the MongoDB database server. This defaults to a local database server at `mongodb://localhost/exercise-tracker`.

Then to execute the tests run `npm test`. Environment variable `APP_URL` is used by the tests to locate the app server. This defaults to a local server at `http://localhost:3000/api/exercise/`. You can also define a local `.env` file with these parameters, and it will be read by the app.
