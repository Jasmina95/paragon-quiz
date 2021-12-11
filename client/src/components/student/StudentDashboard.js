import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Redirect } from 'react-router-dom';
import { getUsername, getRole } from '../auth/auth-helper';
import AllQuizzes from './AllQuizzes';
import DoneQuizzes from './DoneQuizzes';

const StudentDashboard = () => {
  const [values, setValues] = useState({
    quizzes: true,
    done: false
  });

  if (getRole() !== 'student') return <Redirect to='/' />;

  return (
    <Box sx={{ ml: '25px', mr: '25px' }}>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          borderBottom: '1px solid blue'
        }}
      >
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Welcome {getUsername()}!
        </Typography>
        <Button
          onClick={() => setValues({ ...values, quizzes: true, done: false })}
        >
          All Quizzes
        </Button>
        <Button
          onClick={() => setValues({ ...values, quizzes: false, done: true })}
        >
          Done
        </Button>
      </Box>
      {values.quizzes && <AllQuizzes />}
      {values.done && <DoneQuizzes />}
    </Box>
  );
};

export default StudentDashboard;
