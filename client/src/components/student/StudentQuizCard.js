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
import Score from './Score';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const getDate = date => {
  const newDate = date.split('T')[0].split('-');

  return `${newDate[2]}.${newDate[1]}.${newDate[0]}`;
};

const calculateTimeAndDate = quizDate => {
  const today = new Date();
  const newQuizDate = new Date(quizDate);
  const differenceInHours = Math.floor(
    (today - newQuizDate) / (1000 * 60 * 60)
  );

  return differenceInHours;
};

const StudentQuizCard = ({ quiz }) => {
  const [student, setStudent] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
        if (_isMounted.current) {
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
      }
    });
  }, [quiz]);

  const takeQuiz = () => {
    if (
      quizResult?.numberOfTries === 2 ||
      (quizResult?.numberOfTries === 1 &&
        calculateTimeAndDate(quizResult?.scores[0].date) < 24)
    ) {
      setOpenDialog(true);
    } else {
      history.push(`/quiz/solve/${quiz._id}`);
    }
  };

  return (
    <Box>
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
              {getDate(quizResult.scores[quizResult.scores.length - 1].date)}
            </Typography>
            <Divider />
            <CardActions>
              <Button variant='contained' onClick={() => setOpen(true)}>
                Score
              </Button>
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
              <Button variant='contained' onClick={takeQuiz}>
                Take a Quiz
              </Button>
            </CardActions>
          </CardContent>
        )}
        {quizResult &&
          quizResult.status === 'failed' &&
          quizResult.numberOfTries <= 2 && (
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
                <Button variant='contained' onClick={() => setOpen(true)}>
                  Score
                </Button>
                <Button variant='contained' onClick={takeQuiz}>
                  Take a Quiz
                </Button>
              </CardActions>
            </CardContent>
          )}
      </Card>
      <Score open={open} setOpen={setOpen} quiz={quiz} student={student} />
      <Dialog
        maxWidth='sm'
        fullWidth
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogContent sx={{ color: 'red' }}>
          {quizResult?.numberOfTries === 2
            ? 'You already took this quiz twice. No more attempts are allowed!'
            : `You are not able to retake the quiz in the next ${
                24 - calculateTimeAndDate(quizResult?.scores[0].date)
              } hour(s)!`}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentQuizCard;
