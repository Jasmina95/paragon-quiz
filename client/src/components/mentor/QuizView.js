import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { isAuthenticated, getRole, getUser } from '../auth/auth-helper';
import { readQuiz } from '../api-quiz';
import { Redirect } from 'react-router';
import { CardActions } from '@mui/material';
import { useHistory } from 'react-router-dom';

const QuizView = ({ match }) => {
  const [quiz, setQuiz] = useState(null);
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
      }
    });
  }, [match.params.id, token]);

  if (
    quiz &&
    quiz.mentorId &&
    (getRole() !== 'mentor' || parseInt(getUser()) !== parseInt(quiz.mentorId))
  )
    return <Redirect to='/' />;

  return (
    <Card sx={{ width: '60%', margin: 'auto', mt: '20px' }}>
      <CardContent>
        <Typography variant='h6'>{quiz?.quizName}</Typography>
        <Typography variant='subtitle2' sx={{ mt: '15px' }}>
          Description: {quiz?.quizDescription}
        </Typography>
        <Divider />
        <Box sx={{ ml: '5px', mr: '5px', mt: '15px' }}>
          {quiz?.questions &&
            quiz.questions.length > 0 &&
            quiz.questions.map((question, idx) => (
              <Box key={idx}>
                <Typography variant='subtitle1'>
                  {idx + 1}. {question.question}
                </Typography>
                <Box sx={{ display: 'flex', ml: '10px' }}>
                  <Box sx={{ width: '60%' }}>
                    {question.answers &&
                      question.answers.length > 0 &&
                      question.answers.map((answer, idx) => (
                        <Box
                          key={idx}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Box
                            sx={{
                              ml: '10px',
                              mr: '10px',
                              width: '10px',
                              height: '10px',
                              border: '1px solid black',
                              borderRadius: '50%',
                              bgcolor: question.correctAnswers.some(
                                correct => correct === answer
                              )
                                ? 'gray'
                                : 'white'
                            }}
                          />
                          <Typography variant='subtitle1'>{answer}</Typography>
                        </Box>
                      ))}
                  </Box>
                  <Box sx={{ width: '40%', textAlign: 'center' }}>
                    {question.image && (
                      <img
                        src={`${process.env.PUBLIC_URL}/images/${question?.image}`}
                        alt='questionImage'
                        style={{ maxHeight: '100px', maxWidth: '100%' }}
                      />
                    )}
                  </Box>
                </Box>
                <Divider sx={{ mb: '15px' }} />
              </Box>
            ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'right' }}>
        <Button
          variant='contained'
          onClick={() => history.push(`/quiz/results/${match.params.id}`)}
        >
          View Results
        </Button>
        <Button
          variant='contained'
          onClick={() => history.push('/mentor_dashboard')}
        >
          Close
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizView;
