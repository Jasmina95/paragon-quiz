const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname + '../../../../.env')
});
const config = require('../../config/config');

const User = require('../models/user.model');
const Quiz = require('../models/quiz.model');

const users = require('./users.json');
const quizzes = require('./quiz.json');

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

  for (let i = 0; i < quizzes.data.length; i++) {
    if (i === 0) console.log('Seeding quizzes...');
    const obj = {
      mentorId: quizzes.data[i].mentorId || undefined,
      mentorFullName: quizzes.data[i].mentorFullName || undefined,
      quizName: quizzes.data[i].quizName || undefined,
      quizDescription: quizzes.data[i].quizDescription || undefined,
      questions: quizzes.data[i].questions || undefined,
      published: quizzes.data[i].published || undefined,
      publishedDate: Date.now() || undefined
    };
    const modelInstance = new Quiz(obj);
    await modelInstance.save();
  }

  mongoose.connection
    .close()
    .then(() =>
      console.log('Done seeding MongoDB. MongoDB connection is closed!')
    );
}

processData();
