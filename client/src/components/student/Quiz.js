import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { isAuthenticated, getRole, getUser } from '../auth/auth-helper';
import { readQuiz } from '../api-quiz';
import { CardActions } from '@mui/material';
import { useHistory, Redirect } from 'react-router-dom';
import Question from './Question';
import { updateUsersQuiz } from '../api-user';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const Quiz = ({ match }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const _isMounted = useRef(true);

  const history = useHistory();

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    readQuiz(parseInt(match.params.id), token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setQuiz(data);
        let array = {};
        data.questions.forEach((question, index) => {
          array[`question${index + 1}`] = {
            answer1: { value: question.answers[0], selected: false },
            answer2: { value: question.answers[1], selected: false },
            answer3: { value: question.answers[2], selected: false }
          };
        });
        setAnswers(array);
        setErrors(Array(data.questions.length).fill(''));
      }
    });
  }, [match.params.id, token]);

  const submit = () => {
    const array = Object.values(answers);
    let selectedAnswers = [];
    array.forEach(question => {
      let newArr = [];
      Object.entries(question).forEach(questionEntry => {
        if (questionEntry[1].selected) newArr.push(questionEntry[1].value);
      });
    //   for (const [_, value] of Object.entries(question)) {
    //     if (value.selected) newArr.push(value.value);
    //   }
      selectedAnswers.push(newArr);
    });
    if (selectedAnswers.some(answer => answer.length === 0)) {
      let newErrors = [];
      selectedAnswers.forEach(answer => {
        if (answer.length === 0)
          newErrors.push('Please mark one or more answers!');
        else newErrors.push('');
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setErrors(newErrors);
      setError('Please mark one or more answers on each question!');
    } else {
      setErrors(Array(selectedAnswers.length).fill(''));
      setError('');
      setSubmittedAnswers(selectedAnswers);
      setOpen(true);
    }
  };

  const confirmSubmit = () => {
    const obj = {
      answers: submittedAnswers || undefined,
      quizId: quiz._id || undefined
    };

    updateUsersQuiz(getUser(), obj, token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        history.push('/student_dashboard');
        setOpen(false);
      }
    });
  };

  if (getRole() !== 'student') return <Redirect to='/' />;

  return (
    <Box>
      <Card sx={{ width: '60%', margin: 'auto', mt: '20px' }}>
        <CardContent>
          <Typography variant='h6'>{quiz?.quizName}</Typography>
          <Typography variant='subtitle2' sx={{ mt: '15px' }}>
            Description: {quiz?.quizDescription}
          </Typography>
          <Divider />
          {error && (
            <Typography
              variant='subtitle1'
              align='center'
              sx={{ color: 'red', mt: 3 }}
            >
              {error}
            </Typography>
          )}
          <Box sx={{ ml: '5px', mr: '5px', mt: '15px' }}>
            {quiz?.questions &&
              quiz.questions.length > 0 &&
              quiz.questions.map((question, idx) => (
                <Question
                  key={idx}
                  answers={answers}
                  setAnswers={setAnswers}
                  question={question}
                  questionInd={idx}
                  error={errors[idx]}
                />
              ))}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'right' }}>
          <Button variant='contained' onClick={submit}>
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog
        maxWidth='sm'
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          After submitting you can't edit given answers. Are you sure you want
          to submit this Quiz?
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <Button onClick={() => setOpen(false)}>No</Button>
          <Button onClick={confirmSubmit}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quiz;
