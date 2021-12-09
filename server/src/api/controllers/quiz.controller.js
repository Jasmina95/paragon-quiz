const Quiz = require('../models/quiz.model');
const errorHandler = require('../helpers/dbErrorHandler');
const fs = require('fs');
const _ = require('lodash');

const createQuiz = (req, res) => {
  if (req.auth.role === 'mentor') {
    req.body.mentorId = req.auth._id;
    req.body.mentorFullName = req.auth.name;

    if (req.body.published) {
      req.body.publishedDate = Date.now();
    } else {
      req.body.modifiedDate = Date.now();
    }

    const quiz = new Quiz(req.body);
    quiz.save(err => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json({
        message: 'Successful creation of a quiz!'
      });
    });
  } else {
    return res.status(403).json({
      error: 'Only mentor is allowed to create quizzes!'
    });
  }
};

const listDrafts = (req, res) => {
  Quiz.find({
    published: false,
    deleted: false,
    mentorId: req.auth._id
  })
    .sort('-modifiedDate')
    .exec((err, drafts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(drafts);
    });
};

const listPublishedQuizzes = (req, res) => {
  Quiz.find({
    published: true,
    deleted: false,
    mentorId: req.auth._id
  })
    .sort('-publishedDate')
    .exec((err, quizzes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(quizzes);
    });
};

const listAllPublishedQuizzes = (req, res) => {
  Quiz.find({ published: true, deleted: false })
    .sort('mentorFullName')
    .exec((err, quizzes) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(quizzes);
    });
};

const quizById = (req, res, next, id) => {
  Quiz.findById(id).exec((err, quiz) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      });
    }

    req.quiz = quiz;
    next();
  });
};

const read = (req, res) => {
  return res.status(200).json(req.quiz);
};

const update = (req, res) => {
  if (req.auth.role === 'mentor') {
    if (req.body.published) {
      req.body.publishedDate = Date.now();
    } else {
      req.body.modifiedDate = Date.now();
    }
    let quiz = req.quiz;
    quiz = _.extend(quiz, req.body);

    quiz.save((err, updatedQuiz) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(updatedQuiz);
    });
  } else {
    return res.status(403).json({
      error: 'Only mentor is allowed to update quizzes!'
    });
  }
};

const remove = (req, res) => {
  if (req.auth.role === 'mentor') {
    let quiz = req.quiz;
    quiz = _.extend(quiz, { deleted: true });

    quiz.save((err, deletedQuiz) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).json(deletedQuiz);
    });
  } else {
    return res.status(403).json({
      error: 'Only mentor is allowed to delete quizzes!'
    });
  }
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

  if (Array.isArray(files)) {
    files.forEach(file => {
      file.mv(`../client/public/images/${file.name}`, err => {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });
  } else {
    files.mv(`../client/public/images/${files.name}`, err => {
      if (err) {
        return res.status(500).send(err);
      }
    });
  }

  res.status(200).json({ message: 'Successfull upload of images!' });
};

module.exports = {
  createQuiz,
  listDrafts,
  listPublishedQuizzes,
  listAllPublishedQuizzes,
  quizById,
  read,
  update,
  remove,
  getImage,
  uploadImage
};
