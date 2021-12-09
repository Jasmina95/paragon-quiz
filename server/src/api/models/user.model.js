const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  _id: Number,
  firstName: {
    type: String,
    required: 'First name is required',
    match: [
      /^[a-zA-Z0-9 ]*$/,
      'First name: Only letters, numbers, and space are allowed!'
    ]
  },
  lastName: {
    type: String,
    required: 'Last name is required',
    match: [
      /^[a-zA-Z0-9 ]*$/,
      'Last name: Only letters, numbers, and space are allowed!'
    ]
  },
  email: {
    type: String,
    required: 'Email is required',
    unique: 'Email already exists!',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  hashed_password: {
    type: String,
    required: 'Password is required!'
  },
  salt: String,
  role: {
    type: String,
    enum: {
      values: ['student', 'mentor'],
      message: '{VALUE} is not supported!'
    }
  },
  created: {
    type: Date,
    default: Date.now,
    set: changeDate
  },
  quizzes: [
    {
      _id: false,
      quizId: Number,
      status: {
        type: String,
        enum: {
          values: ['passed', 'failed'],
          message: '{VALUE} is not supported!'
        }
      },
      scores: [{
          date: Date,
          score: Number
      }],
      numberOfTries: Number,
      answers: [
        {
          questionId: Number,
          answers: [String],
          correct: Boolean
        }
      ]
    }
  ]
});

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  authenticate: function (plainTextPassword) {
    return this.encryptPassword(plainTextPassword) == this.hashed_password;
  }
};

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters long!');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required!');
  }
});

UserSchema.pre('save', function (next) {
  if (this.role === 'mentor') {
    this.quizzes = undefined;
  }

  next();
});

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

UserSchema.plugin(AutoIncrement, { id: 'user_counter', inc_field: '_id' });

module.exports = mongoose.model('User', UserSchema);
