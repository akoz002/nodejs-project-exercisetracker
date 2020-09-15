
const mongoose = require('mongoose');

/*
 * Schema representing an exercise record.
 */

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true, alias: 'desc' },
  duration: { type: Number, required: true, alias: 'dur' },
  date: { type: Date, default: Date.now }
}, { _id: false }); // exercises do not need an _id

/*
 * Schema representing a user with an exercise log.
 */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  log: [exerciseSchema]
});

module.exports = userSchema;
