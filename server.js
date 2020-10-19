/*
 * freeCodeCamp APIs and Microservices Certification
 * Project 4: Exercise Tracker Microservice
 * Alex Kozlov, 2020
 */

/*
 * The main node.js app script for the Exercise Tracker Microservice.
 */

'use strict';

/*
 * Initial configuration.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

/*
 * Compile MongoDB model.
 */

const User = mongoose.model('User', require('./schemas/userSchema'));

/*
 * Connect to MongoDB.
 */

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err) {
  if (err) throw err;
  console.log("Successfully connected to MongoDB URI: '%s'", process.env.DB_URI);
});

/*
 * Mount middleware.
 */

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

/*
 * Endpoint to create a user.
 */

app.post('/api/exercise/new-user', function(req, res, next) {
  console.log("Received a request to create a new user: '%s'", req.body.username);
  User.create({ username: req.body.username }, function(err, user) {
    if (err) return next(err);
    console.log("Successfully created user '%s'", user.username);
    res.status(201).json({ username: user.username, _id: user._id });
  });
});

/*
 * Endpoint to get all users.
 */

app.get('/api/exercise/users', function(req, res, next) {
  console.log('Received a request to get all users');
  User.find({}, 'username', function(err, users) {
    if (err) return next(err);
    console.log('Successfully retrieved all users');
    res.json(users);
  });
});

/*
 * Endpoint to add an exercise to a user.
 */

app.post('/api/exercise/add', function(req, res, next) {
  if (!req.body.userId) return next({
    status: 400, message: "Form data 'userId' is required to add an exercise"
  });

  console.log("Received a request to add an exercise to user ID '%s'", req.body.userId);
  User.findById(req.body.userId, function(err, user) {
    if (err) return next(err);
    if (!user) return next({
      status: 404, message: `userId '${req.body.userId}' does not exist in the database`
    });

    // add the exercise record
    const { description, duration } = req.body;
    let date = undefined; // use the default date
    if (req.body.date) {
      date = req.body.date;
    }
    user.log.push({ description, duration, date });

    // save the user
    user.save(function(err, user) {
      if (err) return next(err);
      const exercise = user.log[user.log.length - 1];
      console.log("Successfully added the following exercise to user '%s' (ID '%s'):",
        user.username, user._id);
      console.log("'%o'", exercise);

      // return exercise with username and _id
      res.status(201).json({
        username: user.username,
        _id: user._id,
        description: exercise.desc,
        duration: exercise.dur,
        date: exercise.date.toDateString()
      });
    });
  });
});

/*
 * Endpoint to get a user's exercise log.
 */

app.get('/api/exercise/log', function(req, res, next) {
  if (!req.query.userId) return next({
    status: 400, message: "Query parameter 'userId' is required to retrieve a log"
  });
  console.log(`Received a request to get a log for user ID '${req.query.userId}'`);

  // construct an aggregation pipeline
  const aggregate = User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.query.userId) } },
    { $project: { username: 1, log: 1 }}
  ]);

  if (req.query.from) {
    console.log(`Filtering log entries from date '${req.query.from}'`);
    aggregate.addFields({
      log: { $filter: {
        input: '$log',
        as: 'entry',
        cond: { $gte: [ '$$entry.date', new Date(req.query.from) ] }
      }}
    });
  }

  if (req.query.to) {
    console.log(`Filtering log entries to date '${req.query.to}'`);
    aggregate.addFields({
      log: { $filter: {
        input: '$log',
        as: 'entry',
        cond: { $lte: [ '$$entry.date', new Date(req.query.to) ] }
      }}
    });
  }

  if (req.query.limit) {
    console.log(`Limiting log entries to ${req.query.limit}`);
    aggregate.addFields({
      log: { $slice: [ '$log', Number(req.query.limit) ] }
    });
  }

  aggregate.addFields({ count: { $size: '$log' } });

  // execute the aggregation pipeline and return the results
  aggregate.exec(function(err, result) {
    if (err) return next(err);
    if (result.length === 0) return next({
      status: 404, message: `userId '${req.query.userId}' does not exist in the database`
    });

    // reformat to date string
    result[0].log.forEach(entry => {
       entry.date = entry.date.toDateString();
    });

    console.log("Successfully retrieved exercise log for user '%s' (ID '%s')",
      result[0].username, req.query.userId);
    res.json(result[0]);
  });
});

/*
 * Endpoint to delete a user.
 */

app.delete('/api/exercise/delete-user', function(req, res, next) {
  console.log("Received a request to delete user: '%s'", req.body.username);
  User.deleteOne({ username: req.body.username }, function(err, result) {
    if (err) return next(err);

    if (result.deletedCount === 1) {
      const message = `Successfully deleted user '${req.body.username}'`;
      console.log(message);
      res.send(message);
    }
    else next({
      status: 404, message: `No user '${req.body.username}' exists in the database`
    });
  });
});

/*
 * Error Handling middleware.
 */

app.use((err, req, res, next) => {
  console.error('Error Handling middleware caught the following error:');
  console.error(err);

  let errCode = err.status || 500;
  let errMessage = err.message || 'Internal Server Error';

  if (err.errors) {
    // mongoose validation error
    const keys = Object.keys(err.errors);

    // report the first validation error
    errCode = 400; // bad request
    errMessage = err.errors[keys[0]].message;
  }
  else if (err.name === 'MongoError') {
    // general MongoDB error
    errCode = 400; // bad request
    errMessage = err.message || 'Invalid Request';

    if (err.code === 11000) { // duplicate key error
      errMessage = 'Username already exists in the database';
    }
  }

  // send the error response
  res.status(errCode)
    .type('txt')
    .send(errMessage);
});

/*
 * Serve 'index.html' at the root path.
 */

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * Listen for requests.
 */

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port: ' + listener.address().port);
});
