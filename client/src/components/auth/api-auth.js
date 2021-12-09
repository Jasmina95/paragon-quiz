import axios from 'axios';
import baseUrl from '../../assets/config/config';

const signin = async user => {
  try {
    const res = await axios.post(`${baseUrl}/auth/signin`, user);
    sessionStorage.setItem('jwtToken', res.data.token);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    else return err;
  }
};

const signout = () => {
  return axios.get(`${baseUrl}/auth/signout`).then(res => {
    sessionStorage.clear();
    return res.data;
  });
};

export { signin, signout };
