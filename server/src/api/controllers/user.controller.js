const User = require('../models/user.model');
const Quiz = require('../models/quiz.model');
const errorHandler = require('../helpers/dbErrorHandler');
const _ = require('lodash');

function changeDate(created) {
  let dateTime = new Date(created);
  const offset = dateTime.getTimezoneOffset();
  dateTime.setHours(
    dateTime.getHours(),
    dateTime.getMinutes() - offset,
    dateTime.getSeconds(),
    dateTime.getMilliseconds()
  );

  return dateTime;
}

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: 'User not found!'
      });
    }

    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.status(200).json(req.profile);
};

const updateQuizResults = (req, res) => {
  //console.log(req.body);
  let user = req.profile;
  //console.log(user);
  Quiz.findById(req.body.quizId).exec((err, quiz) => {
    if (err || !quiz) {
      return res.status(400).json({ error: 'Quz not found!' });
    } else {
      //console.log(quiz);
      let answers = [];
      quiz.questions.forEach((question, index) => {
        let correct = true;
        if (question.correctAnswers.length === req.body.answers[index].length) {
          req.body.answers[index].forEach(bodyAnswer => {
            if (
              !question.correctAnswers.some(
                quizAnswer => quizAnswer === bodyAnswer
              )
            )
              correct = false;
          });
        } else correct = false;
        answers.push({
          questionId: index,
          answers: req.body.answers[index],
          correct: correct
        });
      });

      //console.log(answers);

      const score = answers.filter(({ correct }) => correct === true).length;
      const status =
        Math.round((score / answers.length) * 100) >= 50 ? 'passed' : 'failed';
      //console.log(answers);

      if (
        user.quizzes &&
        user.quizzes.length > 0 &&
        user.quizzes.some(({ quizId }) => quizId === req.body.quizId)
      ) {
        let userQuiz = user.quizzes.filter(
          ({ quizId }) => quizId === req.body.quizId
        )[0];

        if (userQuiz.numberOfTries < 2) {
          let userQuizzes = user.quizzes;
          let quizResult = {
            status: status,
            scores: [
              ...userQuiz.scores,
              {
                date: changeDate(Date.now()),
                score: score
              }
            ],
            numberOfTries: userQuiz.numberOfTries + 1,
            answers: answers
          };
          userQuiz = _.extend(userQuiz, quizResult);
          //console.log(userQuiz);
          let newQuizResults = user.quizzes.map(takenQuiz =>
            takenQuiz === req.body.quizId ? userQuiz : takenQuiz
          );

          user = _.extend(user, { quizzes: newQuizResults });
          user.save((err, savedUser) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
              });
            }
            //console.log(savedUser);
            res.status(200).json(savedUser);
          });
        } else {
          return res.status(400).json({
            eror: 'You are only allowed to take this quiy twice. No more tries left!'
          });
        }

        //console.log(userQuiz);

        //console.log(userQuiz);
      } else {
        let quizResult = {
          quizId: req.body.quizId,
          status: status,
          scores: [
            {
              date: Date.now(),
              score: score
            }
          ],
          numberOfTries: 1,
          answers: answers
        };

        user = _.extend(user, { quizzes: [...user.quizzes, quizResult] });
        user.save((err, savedUser) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)
            });
          }
          //console.log(savedUser);
          res.status(200).json(savedUser);
        });
      }
    }
  });
};

const getDoneQuizzes = (req, res) => {
  const user = req.profile;
  let doneQuizzes = user.quizzes.filter(({ status }) => status === 'passed');

  let quizIds = [];
  doneQuizzes.forEach(quiz => quizIds.push(quiz.quizId));

  //console.log(quizIds);

  if (quizIds.length > 0) {
    Quiz.find({ _id: { $in: quizIds } }).exec((err, quizzes) => {
      if (err) {
        return res.status(404).json({
          error: 'Quizzes not found!'
        });
      }

      res.status(200).json(quizzes);
    });
  } else {
    res.status(200).json([]);
  }
};

module.exports = { userById, read, updateQuizResults, getDoneQuizzes };
