const User = require('../models/user.model');
const config = require('../../config/config.js');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user || user.active === false) {
      return res.status(400).json({
        error: 'Wrong credentials, please try again!'
      });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: 'Wrong credentials, please try again!'
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      },
      config.jwtSecret
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        role: user.role
      }
    });
  });
};

const signout = (req, res) => {
  return res.status(200).json({
    message: 'You successfully signed out!'
  });
};

const requireSignIn = expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
});

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    (req.profile._id == req.auth._id || req.auth.role === 'admin');

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized!'
    });
  }

  next();
};

module.exports = {
  signin,
  signout,
  requireSignIn,
  hasAuthorization
};
