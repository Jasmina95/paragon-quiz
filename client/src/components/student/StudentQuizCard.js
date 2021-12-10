import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { getUser, isAuthenticated } from '../auth/auth-helper';
import { read } from '../api-user';
import { CardActions } from '@mui/material';

const getDate = date => {
  const newDate = date.split('T')[0].split('-');
  const time = date.split('T')[1].split(':');

  return `${newDate[2]}.${newDate[1]}.${newDate[0]}`;
};

const StudentQuizCard = ({ quiz }) => {
  const [student, setStudent] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const history = useHistory();
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    read(getUser(), isAuthenticated()).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setStudent(data);
        if (data.quizzes && data.quizzes.length > 0) {
          const result = data.quizzes.filter(
            quizData => quizData.quizId === quiz._id
          );
          if (result && result.length > 0) {
            setQuizResult(result[0]);
          }
        }
      }
    });
  }, []);

  return (
    <Card
      sx={{
        width: '300px',
        height: '400px',
        mr: '20px',
        mb: '30px',
        position: 'relative'
      }}
    >
      <CardContent>
        <Typography variant='h6'>{quiz.quizName}</Typography>
        <Typography variant='subtitle1'>by {quiz.mentorFullName}</Typography>
        <Divider sx={{ mb: '10px' }} />
        <Typography variant='subtitle2' align='justify'>
          {quiz.quizDescription}
        </Typography>
        <Typography
          variant='subtitle1'
          align='justify'
          sx={{ position: 'absolute', bottom: 0 }}
        ></Typography>
      </CardContent>
      {quizResult && quizResult.status === 'passed' && (
        <CardContent sx={{ position: 'absolute', bottom: 0 }}>
          <Typography variant='subtitle1'>
            Quiz passed:{' '}
            {getDate(quizResult.scores[quizResult.scores.length - 1])}
          </Typography>
          <Divider />
          <CardActions>
            <Button variant='contained'>Score</Button>
          </CardActions>
        </CardContent>
      )}
      {!quizResult && (
        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            width: 'inherit',
            boxSizing: 'border-box'
          }}
        >
          <Typography variant='subtitle1'>
            Published on: {getDate(quiz.publishedDate)}
          </Typography>
          <Divider />
          <CardActions>
            <Button
              variant='contained'
              onClick={() => history.push(`/quiz/solve/${quiz._id}`)}
            >
              Take a Quiz
            </Button>
          </CardActions>
        </CardContent>
      )}
      {quizResult &&
        quizResult.status === 'failed' &&
        quizResult.numberOfTries < 2 && (
          <CardContent
            sx={{
              position: 'absolute',
              bottom: 0,
              width: 'inherit',
              boxSizing: 'border-box'
            }}
          >
            <Typography variant='subtitle1'>
              Published on: {getDate(quiz.publishedDate)}
            </Typography>
            <Divider />
            <CardActions>
              <Button variant='contained'>Score</Button>
              <Button
                variant='contained'
                onClick={() => history.push(`/quiz/solve/${quiz._id}`)}
              >
                Take a Quiz
              </Button>
            </CardActions>
          </CardContent>
        )}
    </Card>
  );
};

export default StudentQuizCard;
