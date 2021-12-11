import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Redirect } from 'react-router-dom';
import { isAuthenticated, getRole } from '../auth/auth-helper';
import { listAllPublishedQuizzes } from '../api-quiz';
import StudentQuizCard from './StudentQuizCard';

const AllQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const _isMounted = useRef(true);

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    listAllPublishedQuizzes(token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (_isMounted.current) setQuizzes(data);
      }
    });
  }, [token]);

  if (getRole() !== 'student') return <Redirect to='/' />;

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
          quizzes.map(quiz => <StudentQuizCard key={quiz._id} quiz={quiz} />)}
      </Box>
    </Box>
  );
};

export default AllQuizzes;
