import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import QuestionAdd from './QuestionAdd';
import Question from './Question';
import { updateQuiz, uploadImage, readQuiz } from '../api-quiz';
import { isAuthenticated } from '../auth/auth-helper';

const QuizEdit = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    quizName: '',
    quizDescription: '',
    questions: [],
    error: ''
  });
  const _isMounted = useRef(true);

  const history = useHistory();

  const token = isAuthenticated();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    readQuiz(parseInt(match.params.id), token).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        if (_isMounted.current) {
          setValues({
            ...values,
            quizName: data.quizName,
            quizDescription: data.quizDescription,
            questions: data.questions || []
          });
        }
      }
    });
  }, [match.params.id, token]);

  const onChangeHandler = field => e => {
    setValues({ ...values, [field]: e.target.value });
  };

  const submitQuiz = value => () => {
    let newQuestions = [];

    if (values.questions && values.questions.length > 0) {
      newQuestions = values.questions.map(question => {
        return {
          question: question.question,
          answers: question.answers,
          correctAnswers: question.correctAnswers,
          image: question.image || ''
        };
      });
    }

    const quiz = {
      quizName: values.quizName || undefined,
      quizDescription: values.quizDescription || undefined,
      questions: newQuestions,
      published: value
    };

    updateQuiz(parseInt(match.params.id), quiz, token).then(data => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        if (values.questions && values.questions.length > 0) {
          const formData = new FormData();
          let update = false;
          values.questions.forEach(question => {
            if (question.file) {
              formData.append('files[]', question.file);
              update = true;
            }
          });
          if (update) {
            uploadImage(formData, token);
          }
        }
        history.push('/mentor_dashboard');
      }
    });

    //console.log(files);
  };

  return (
    <Box sx={{ width: '50%', margin: 'auto' }}>
      <TextField
        label='Quiz Name'
        value={values.quizName}
        onChange={onChangeHandler('quizName')}
        size='small'
        fullWidth
        margin='dense'
      />
      <TextField
        label='Quiz Description'
        value={values.quizDescription}
        onChange={onChangeHandler('quizDescription')}
        multiline
        minRows={4}
        size='small'
        fullWidth
        margin='dense'
      />
      {values.questions &&
        values.questions.length > 0 &&
        values.questions.map((question, idx) => (
          <Question
            key={idx}
            question={question}
            idx={idx}
            values={values}
            setValues={setValues}
          />
        ))}
      {values.error && (
        <Typography
          variant='subtitle1'
          align='center'
          sx={{ color: 'red', mt: 3 }}
        >
          {values.error}
        </Typography>
      )}
      {values.questions && values.questions.length <= 30 && (
        <Button
          variant='contained'
          onClick={() => setOpen(true)}
          sx={{ mt: '20px' }}
        >
          Add question
        </Button>
      )}
      <Box sx={{ width: '100%', textAlign: 'right', mt: '40px' }}>
        <Button
          variant='contained'
          onClick={() => history.push('/mentor_dashboard')}
          sx={{ mt: '20px', mr: '5px' }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={submitQuiz(false)}
          sx={{ mt: '20px', mr: '5px' }}
        >
          Save as Draft
        </Button>
        <Button
          variant='contained'
          onClick={submitQuiz(true)}
          sx={{ mt: '20px' }}
        >
          Publish Quiz
        </Button>
      </Box>

      <QuestionAdd
        values={values}
        setValues={setValues}
        open={open}
        setOpen={setOpen}
      />
    </Box>
  );
};

export default QuizEdit;