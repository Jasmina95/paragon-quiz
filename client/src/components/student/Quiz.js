import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { isAuthenticated, getRole } from '../auth/auth-helper';
import { readQuiz } from '../api-quiz';
import { CardActions } from '@mui/material';
import { useHistory, Redirect } from 'react-router-dom';
import Question from './Question';

const Quiz = ({ match }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState(null);
  const _isMounted = useRef(true);

  const history = useHistory();

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  console.log(answers);

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
      }
    });
  }, [match.params.id, token]);

  if (getRole() !== 'student') return <Redirect to='/' />;

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
              <Question
                key={idx}
                answers={answers}
                setAnswers={setAnswers}
                question={question}
                questionInd={idx}
              />
            ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'right' }}>
        <Button
          variant='contained'
          onClick={() => history.push(`/quiz/results/${match.params.id}`)}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default Quiz;
