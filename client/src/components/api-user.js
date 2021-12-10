import axios from 'axios';
import baseUrl from '../assets/config/config';

const read = async (id, token) => {
  try {
    const res = await axios.get(`${baseUrl}/api/users/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    return res.data;
  } catch (err) {
    return err.response.data;
  }
};

export { read };
