import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory, Redirect } from 'react-router-dom';
import { getUsername, getRole } from '../auth/auth-helper';
import MyQuizzes from './MyQuizzes';
import MyDrafts from './MyDrafts';

const MentorDashboard = () => {
  const history = useHistory();
  const [values, setValues] = useState({
    quizzes: true,
    drafts: false
  });

  if (getRole() !== 'mentor') return <Redirect to='/' />;

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
          onClick={() => setValues({ ...values, quizzes: true, drafts: false })}
        >
          My Quizzes
        </Button>
        <Button
          onClick={() => setValues({ ...values, quizzes: false, drafts: true })}
        >
          My Drafts
        </Button>
        <Button onClick={() => history.push('/newQuiz')}>Add Quiz</Button>
      </Box>
      {values.drafts && <MyDrafts />}
      {values.quizzes && <MyQuizzes />}
    </Box>
  );
};

export default MentorDashboard;
