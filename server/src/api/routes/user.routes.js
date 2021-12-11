const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/api/users/:userId')
  .get(authCtrl.requireSignIn, userCtrl.read)
  .put(authCtrl.requireSignIn, userCtrl.updateQuizResults);

router.param('userId', userCtrl.userById);

module.exports = router;
