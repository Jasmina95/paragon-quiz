import jwtDecode from 'jwt-decode';

const isAuthenticated = () => {
  if (typeof window == 'undefined') return false;

  if (sessionStorage.getItem('jwtToken')) {
    return sessionStorage.getItem('jwtToken');
  } else return false;
};

const getUser = () => {
  if (typeof window == 'undefined') return false;

  if (sessionStorage.getItem('jwtToken')) {
    return jwtDecode(sessionStorage.getItem('jwtToken'))._id;
  } else return false;
};

const getRole = () => {
  if (typeof window == 'undefined') return false;

  if (sessionStorage.getItem('jwtToken')) {
    return jwtDecode(sessionStorage.getItem('jwtToken')).role;
  } else return false;
};

export { isAuthenticated, getUser, getRole };
