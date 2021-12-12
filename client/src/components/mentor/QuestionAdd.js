import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Redirect } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import QuestionAnswer from './QuestionAnswer';
import { getImage } from '../api-quiz';
import { isAuthenticated, getRole } from '../auth/auth-helper';

const QuestionAdd = ({ values, setValues, open, setOpen }) => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState({
    answer1: '',
    answer2: '',
    answer3: ''
  });
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const ref = useRef();

  const _isMounted = useRef(true);

  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (image) {
      const ac = new AbortController();
      getImage(image, isAuthenticated()).then(data => {
        if (data && data.error) {
          console.log(data.error);
        } else if (data && _isMounted.current) {
          setFile('');
        }
      });
      return () => ac.abort();
    } //eslint-disable-next-line
  }, [image]);

  const handleChange = e => {
    setFile(e.target.files[0]);
    setImage(e.target.files[0]?.name);
  };

  const addAnswer = () => {
    const num = Object.keys(answers).length;
    setAnswers({ ...answers, [`answer${num + 1}`]: '' });
  };

  const addQuestion = () => {
    if (!question) {
      setError('Question Content is required!');
    } else if (
      Object.values(answers).length !== 3 ||
      Object.values(answers).some(value => value === '' || value === undefined)
    ) {
      setError('There must be three possible answers given!');
    } else if (correctAnswers.length === 0) {
      setError('It should be at least one correct answer!');
    } else {
      setValues({
        ...values,
        questions: [
          ...values.questions,
          {
            question: question,
            answers: [answers.answer1, answers.answer2, answers.answer3],
            correctAnswers: correctAnswers,
            image: image,
            file: file
          }
        ]
      });

      setQuestion('');
      setAnswers({
        answer1: '',
        answer2: '',
        answer3: ''
      });
      setImage('');
      setFile('');
      setCorrectAnswers([]);
      setError('');

      setOpen(false);
    }

    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  };

  const cancelQuestionCreation = () => {
    setQuestion('');
    setAnswers({
      answer1: '',
      answer2: '',
      answer3: ''
    });
    setImage('');
    setFile('');
    setError('');
    setCorrectAnswers([]);

    setOpen(false);
  };

  if (getRole() !== 'mentor') return <Redirect to='/' />;

  return (
    <Dialog maxWidth='md' fullWidth open={open}>
      <div ref={ref} style={{ overflowY: 'auto' }}>
        <DialogContent>
          <Typography variant='h6'>New Question</Typography>
          <Divider />
          <Box sx={{ mt: '15px' }}>
            {error && (
              <Typography
                variant='subtitle1'
                align='center'
                sx={{ color: 'red', mt: 3 }}
              >
                {error}
              </Typography>
            )}
            <Typography variant='subtitle1'>
              Question: {values.questions.length + 1}
            </Typography>
            <Box>
              <TextField
                value={question}
                onChange={e => setQuestion(e.target.value)}
                size='small'
                fullWidth
                margin='dense'
              />
              {file && (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    style={{
                      marginBottom: '20px',
                      maxWidth: '100%',
                      maxHeight: '150px'
                    }}
                    alt='img'
                  />
                </Box>
              )}
              {!file && image && (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${image}`}
                    style={{
                      marginBottom: '20px',
                      maxWidth: '100%',
                      maxHeight: '150px'
                    }}
                    alt='img'
                  />
                </Box>
              )}
              <form
                id='form'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '20px'
                }}
              >
                <label
                  htmlFor='file-upload'
                  className='custom-file-upload'
                  style={{
                    border: '1px solid #ccc',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    width: '100%',
                    margin: 'auto',
                    marginTop: '15px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    backgroundColor: '#EEEEEE'
                  }}
                >
                  Upload New Image
                </label>
                <input
                  id='file-upload'
                  type='file'
                  accept='image/jpg, image/jpeg, image/png'
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
              </form>
              <Typography variant='subtitle1' sx={{}}>
                Answers
              </Typography>
              <Box>
                {answers &&
                  Object.keys(answers).length > 0 &&
                  Object.keys(answers).map((answer, idx) => (
                    <QuestionAnswer
                      key={idx}
                      idx={idx}
                      answerKey={answer}
                      answers={answers}
                      setAnswers={setAnswers}
                      correctAnswers={correctAnswers}
                      setCorrectAnswers={setCorrectAnswers}
                    />
                  ))}
              </Box>
              {answers && Object.keys(answers).length < 3 && (
                <Button variant='contained' onClick={addAnswer}>
                  Add Answer
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={addQuestion}>
            Add
          </Button>
          <Button variant='contained' onClick={cancelQuestionCreation}>
            Cancel
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default QuestionAdd;
