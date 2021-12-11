import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Redirect } from 'react-router-dom';
import { isAuthenticated, getRole } from '../auth/auth-helper';
import { listDrafts } from '../api-quiz';
import QuizCard from './QuizCard';

const MyDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const _isMounted = useRef(true);

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    listDrafts(token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (_isMounted.current) setDrafts(data);
      }
    });
  }, [token]);

  if (getRole() !== 'mentor') return <Redirect to='/' />;

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant='h6' sx={{ mt: '20px' }}>
        My Drafts
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
        {drafts &&
          drafts.length > 0 &&
          drafts.map(draft => <QuizCard key={draft._id} quiz={draft} />)}
      </Box>
    </Box>
  );
};

export default MyDrafts;
