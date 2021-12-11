import React, { useEffect, useRef, useState } from 'react';
import { getDoneQuizzes } from '../api-user';
import { isAuthenticated, getUser, getRole } from '../auth/auth-helper';
import { Redirect, useHistory } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StudentQuizCard from './StudentQuizCard';

const DoneQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getDoneQuizzes(getUser(), isAuthenticated()).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (_isMounted.current) {
          setQuizzes(data);
        }
        //console.log(data);
      }
    });
  });

  if (getRole() !== 'student') return <Redirect to='/' />;

  return (
    <Box>
      <Typography variant='h6' sx={{ mt: '20px' }}>
        Successfully passed quizzes
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

export default DoneQuizzes;
