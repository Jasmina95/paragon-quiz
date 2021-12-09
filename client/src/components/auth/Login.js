import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { signin } from './api-auth';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory } from 'react-router-dom';

const Login = ({ setAuthenticated }) => {
  const theme = useTheme();
  const matchesTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const matchesLaptop = useMediaQuery(theme.breakpoints.up('md'));
  const history = useHistory();

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: ''
  });

  const handleChange = field => e => {
    setValues({ ...values, [field]: e.target.value });
  };

  const onClickSignin = e => {
    e.preventDefault();

    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    };

    signin(user).then(data => {
      if (data && data.error) {
        setValues({ ...values, error: data.error, email: '', password: '' });
      } else {
        setValues({ ...values, error: '', email: '', password: '' });
        setAuthenticated(true);
        if (data.user.role === 'mentor') history.push('/mentor_dashboard');
        else if (data.user.role === 'student')
          history.push('/student_dashboard');
      }
    });
  };

  return (
    <Box>
      <fieldset
        style={{
          border: 'solid 1px black',
          width: matchesLaptop ? '40%' : matchesTablet ? '50%' : '90%',
          margin: 'auto',
          marginTop: '40px'
        }}
      >
        <legend>LOGIN</legend>
        <Box sx={{ textAlign: 'center' }}>
          <TextField
            label='Email'
            required
            type='email'
            value={values.email}
            onChange={handleChange('email')}
            size='small'
            margin='dense'
            fullWidth
          />
          <TextField
            label='Password'
            required
            type='password'
            value={values.password}
            onChange={handleChange('password')}
            size='small'
            margin='dense'
            fullWidth
          />
          {values.error && (
            <Typography
              variant='subtitle1'
              align='center'
              sx={{ color: 'red', mt: 3 }}
            >
              {values.error}
            </Typography>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={onClickSignin}
            sx={{ mt: '20px' }}
          >
            LOGIN
          </Button>
        </Box>
      </fieldset>
    </Box>
  );
};

export default Login;
