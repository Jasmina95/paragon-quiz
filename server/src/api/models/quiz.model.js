const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const QuizSchema = new mongoose.Schema({
  _id: Number,
  mentorId: {
    type: Number,
    required: 'Mentor Id is required!'
  },
  mentorFullName: {
    type: String,
    required: 'Mentor full name is required'
  },
  quizName: {
    type: String,
    required: 'Quiz name is required!',
    unique: 'Quiz name already exists!',
    maxLength: [100, 'Quiz name: Max 100 characters allowed!'],
    match: [
      /^[a-zA-Z0-9 ]*$/,
      'Quiz name: Only letters, numbers, and space are allowed!'
    ]
  },
  quizDescription: {
    type: String,
    required: 'Quiz Description is required!',
    maxLength: [500, 'Quiz description: Max 500 characters allowed!']
  },
  questions: {
    type: [
      {
        question: {
          type: String,
          required: 'Question is required!'
        },
        answers: [String],
        correctAnswers: [String],
        image: String
      }
    ],
    required: 'Questions are required!'
  },
  deleted: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  modifiedDate: {
    type: Date,
    set: changeDate
  },
  publishedDate: {
    type: Date,
    set: changeDate
  }
});

QuizSchema.path('questions').validate(function (questions) {
  if (!questions) return false;
  else if (questions.length > 30) return false;
  else return true;
}, 'Maximum number of questions per quiz is 30!');

QuizSchema.path('questions').validate(function (questions) {
  if (!questions) return false;
  else if (questions.length < 5 && this.published === true) return false;
  else return true;
}, 'Minimum number of questions per quiz is 5!');

QuizSchema.path('questions.answers').validate(function (answers) {
  if (!answers) return false;
  else if (answers.length !== 3) return false;
  else return true;
}, 'Three possible answers per question are required!');

QuizSchema.path('questions.correctAnswers').validate(function (answers) {
  if (!answers) return false;
  else if (answers.length === 0) return false;
  else return true;
}, 'At least one correct answer is required!');

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

QuizSchema.plugin(AutoIncrement, { id: 'quiz_counter', inc_field: '_id' });

module.exports = mongoose.model('Quiz', QuizSchema);
