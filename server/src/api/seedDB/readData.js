const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname + '../../../../.env')
});
const config = require('../../config/config');

const User = require('../models/user.model');

const users = require('./users.json');

async function processData() {
  mongoose.Promise = global.Promise;
  mongoose
    .connect(config.mongoUri)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(() => console.log('Error connecting to MongoDB'));

  for (let i = 0; i < users.data.length; i++) {
    if (i === 0) console.log('Seeding users...');

    const obj = {
      firstName: users.data[i].firstName || undefined,
      lastName: users.data[i].lastName || undefined,
      email: users.data[i].email || undefined,
      password: users.data[i].password || undefined,
      role: users.data[i].role || undefined
    };

    const modelInstance = new User(obj);
    await modelInstance.save();
  }

  /*for (let i = 0; i < courses.data.length; i++) {
    if (i === 0) console.log('Seeding courses...');
    const obj = {
      title: courses.data[i].title || undefined,
      description: courses.data[i].description || undefined,
      level: courses.data[i].level || undefined,
      duration: courses.data[i].duration || undefined,
      mentors: courses.data[i].mentors || undefined
    };
    const modelInstance = new Course(obj);
    await modelInstance.save();
  }*/

  mongoose.connection
    .close()
    .then(() =>
      console.log('Done seeding MongoDB. MongoDB connection is closed!')
    );
}

processData();
