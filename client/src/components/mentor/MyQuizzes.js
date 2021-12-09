import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory, Redirect } from 'react-router-dom';
import { getUsername, isAuthenticated, getRole } from '../auth/auth-helper';
import { listPublishedQuizzes } from '../api-quiz';
import QuizCard from './QuizCard';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const _isMounted = useRef(true);

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    listPublishedQuizzes(token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (_isMounted.current) setQuizzes(data);
      }
    });
  }, []);

  if (getRole() !== 'mentor') return <Redirect to='/' />;

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant='h6' sx={{ mt: '20px' }}>
        My Quizzes
      </Typography>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          width: 'fit-content',
          mt: '20px',
          flexWrap: 'wrap'
        }}
      >
        {quizzes &&
          quizzes.length > 0 &&
          quizzes.map(quiz => <QuizCard key={quiz._id} quiz={quiz} />)}
      </Box>
    </Box>
  );
};

export default MyQuizzes;
