# Paragon Quiz

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Description

The system should enable the teacher to post different kinds of quizzes, to publish it when he is ready and also enable students to take the quizzes and see progress on their dashboard. The system will be accessible by all Paragon teachers and students.

## Paragon Quiz Rules:

- A teacher creates a quiz.
- A student takes a quiz.
- A quiz can have any number of questions (e.g. 3, 5, or 10) up to 30.
- Questions can have a single correct answer (single choice) or many correct answers (multichoice)
- When students submit their answers, they see the result page of their score.
- A 50% score is required to pass a quiz.
- In case of failure, a student can take the quiz again 24 hours later.
- In case of failing the quiz twice, a student cannot retake the quiz.
- A teacher can work on the quiz and, when ready, publish the quiz to students.

## Built With

- Node.js
- Express
- MongoDB and Mongoose
- React.js
- Material-UI

## To get a local copy up and running follow these simple steps:

1. Clone the repo

### `https://github.com/Jasmina95/paragon-quiz.git`

2. Install NPM packages

### `npm install`

3. Start the project by running following command in the server folder

### `npm run dev`

4. If problems occur, run frontend and backend separately. Use

### `npm run server`

to run the backend in the server folder, and

### `npm start`

to run the frontend in the client folder

5. In order to seed database navigate to seedDB folder and run

### `node readData.js`

inside console.

6. For testing purposes use following credentials:
   - Mentor: email: paragon@paragon.ba, password: Paragon202!
   - Student: email: fikreta@gmail.com, password: changeMe!
