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

// const listQuizzes = async token => {
//   try {
//     const res = await axios.get(`${baseUrl}/quizzes`, {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token
//       }
//     });

//     return res.data;
//   } catch (err) {
//     if (err.response && err.response.data) {
//       return err.response.data;
//     } else return err;
//   }
// };

const listDrafts = async token => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/drafts`, {
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

const listPublishedQuizzes = async token => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/published`, {
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

const listAllPublishedQuizzes = async token => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/published/all`, {
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

const readQuiz = async (id, token) => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/quiz/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    return res.data;
  } catch (err) {
    return console.log(err.data);
  }
};

const getStudentScores = async (id, token) => {
  try {
    const res = await axios.get(`${baseUrl}/quizzes/quiz/user_results/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
    return res.data;
  } catch (err) {
    return console.log(err.data);
  }
};

const updateQuiz = async (id, quiz, token) => {
  try {
    const res = await axios.put(`${baseUrl}/quizzes/quiz/${id}`, quiz, {
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

const removeQuiz = async (id, token) => {
  try {
    const res = await axios.delete(`${baseUrl}/quizzes/quiz/${id}`, {
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

export {
  createQuiz,
  listDrafts,
  listPublishedQuizzes,
  listAllPublishedQuizzes,
  readQuiz,
  getStudentScores,
  updateQuiz,
  removeQuiz,
  getImage,
  uploadImage
};
