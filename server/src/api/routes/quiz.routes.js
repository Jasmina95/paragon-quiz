const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const quizCtrl = require('../controllers/quiz.controller');

const router = express.Router();

router
  .route('/quizzes')
  .post(authCtrl.requireSignIn, quizCtrl.createQuiz)

router
  .route('/quizzes/drafts')
  .get(authCtrl.requireSignIn, quizCtrl.listDrafts);

router
  .route('/quizzes/published')
  .get(authCtrl.requireSignIn, quizCtrl.listPublishedQuizzes);

router
  .route('/quizzes/published/all')
  .get(authCtrl.requireSignIn, quizCtrl.listAllPublishedQuizzes);

router
  .route('/quizzes/quiz/:quizId')
  .get(authCtrl.requireSignIn, quizCtrl.read)
  .put(authCtrl.requireSignIn, quizCtrl.update)
  .delete(authCtrl.requireSignIn, quizCtrl.remove);

router
  .route('/quizzes/image')
  .post(authCtrl.requireSignIn, quizCtrl.uploadImage)
  .get(authCtrl.requireSignIn, quizCtrl.getImage);

router.param('quizId', quizCtrl.quizById);

module.exports = router;
