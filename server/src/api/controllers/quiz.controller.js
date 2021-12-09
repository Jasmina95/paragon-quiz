const Quiz = require('../models/quiz.model');
const errorHandler = require('../helpers/dbErrorHandler');
const fs = require('fs');

const createQuiz = (req, res) => {
  if (req.auth.role === 'mentor') {
    req.body.mentorId = req.auth._id;
    const quiz = new Quiz(req.body);
    quiz.save((err, savedQuiz) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(savedQuiz);
    });
  } else {
    return res.status(403).json({
      error: 'Only mentor is allowed to create quizzes!'
    });
  }
};

const listQuizzes = (req, res) => {
  Quiz.find({ deleted: false }).exec((err, quizzes) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).json(quizzes);
  });
};

const getImage = (req, res) => {
  const directoryPath = '../client/public/images/';
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Something went wrong while trying to read directory!'
      });
    }

    const file = files.filter(item => item === req.query.image)[0];

    res.status(200).json(file);
  });
};

const uploadImage = (req, res) => {
  if (req.files === null) {
    return res.status(400).json({
      error: 'No file was uploaded!'
    });
  }

  const files = req.files['files[]'];

  //console.log(files);

  files.forEach(file => {
    file.mv(`../client/public/images/${file.name}`, err => {
      if (err) {
        return res.status(500).send(err);
      }
    });
  });
  res.status(200).json({ message: 'Successfull upload of images!' });
};

module.exports = { createQuiz, listQuizzes, getImage, uploadImage };
