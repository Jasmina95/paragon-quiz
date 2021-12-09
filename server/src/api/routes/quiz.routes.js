const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const quizCtrl = require('../controllers/quiz.controller');

const router = express.Router();

router
  .route('/quizzes')
  .post(authCtrl.requireSignIn, quizCtrl.createQuiz)
  .get(authCtrl.requireSignIn, quizCtrl.listQuizzes);

router
  .route('/quizzes/image')
  .post(authCtrl.requireSignIn, quizCtrl.uploadImage)
  .get(authCtrl.requireSignIn, quizCtrl.getImage);

module.exports = router;
