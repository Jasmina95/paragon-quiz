import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';

const MentorDashboard = () => {
  const history = useHistory();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Button
          variant='contained'
          onClick={() => history.push('/newQuiz')}
          sx={{ mr: '20px' }}
        >
          Add Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default MentorDashboard;
