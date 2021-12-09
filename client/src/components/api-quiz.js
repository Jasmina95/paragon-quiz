import axios from 'axios';
import baseUrl from '../assets/config/config';

const createQuiz = async (quiz, token) => {
  try {
    const res = await axios.post(`${baseUrl}/quizzes`, quiz, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    } else return err;
  }
};

const listQuizzes = async token => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });

    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      return err.response.data;
    } else return err;
  }
};

const getImage = async (image, token) => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/image`, {
      params: {
        image: image
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    else return err;
  }
};

const uploadImage = async (formData, token) => {
  try {
    const res = await axios.post(`${baseUrl}/quizzes/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token
      }
    });
    return res.data;
  } catch (err) {
    if (err.response.status === 500) {
      console.log('Problem with server!');
    } else {
      console.log(err.response.data);
      return err.response.data;
    }
  }
};

export { createQuiz, listQuizzes, getImage, uploadImage };
