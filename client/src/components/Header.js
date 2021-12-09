import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useHistory, Link } from 'react-router-dom';
import logo from '../assets/images/quiz-logo.jpg';
import { isAuthenticated, getRole } from './auth/auth-helper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { signout } from './auth/api-auth';

const Header = ({ authenticated, setAuthenticated }) => {
  const [signedIn, setSignedIn] = useState(isAuthenticated());
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const history = useHistory();
  const role = getRole();

  useEffect(() => {
    setSignedIn(authenticated);
  }, [authenticated]);

  const onClickSignout = () => {
    signout().then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setAuthenticated(false);
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <AppBar position='fixed'>
        <Toolbar sx={{ pt: '5px', pb: '5px' }}>
          <Box>
            <img
              src={logo}
              alt='logo'
              style={{ width: matches ? '60px' : '80px' }}
            />
          </Box>
          <Typography variant='h5' sx={{ flexGrow: 1, ml: '15px' }}>
            Paragon Quiz
          </Typography>
          {(signedIn || authenticated) && (
            <Link
              to='/'
              onClick={onClickSignout}
              style={{
                color: 'white',
                textDecoration: 'none'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  '&::first-letter': { textDecoration: 'underline' },
                  '&:hover': { fontWeight: 'bold' }
                }}
              >
                Log out
              </Typography>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
