import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const QuestionAnswer = ({
  idx,
  answerKey,
  answers,
  setAnswers,
  correctAnswers,
  setCorrectAnswers
}) => {
  const [correct, setCorrect] = useState(
    (correctAnswers.length > 0 &&
      correctAnswers.some(answer => answer === answers[answerKey])) ||
      false
  );

  useEffect(() => {
    if (correct) {
      if (!correctAnswers.some(answer => answer === answers[answerKey]))
        setCorrectAnswers([...correctAnswers, answers[answerKey]]);
    } else {
      const newCorrect = correctAnswers.filter(
        answer => answer !== answers[answerKey]
      );

      setCorrectAnswers(newCorrect);
    }
  }, [correct]);

  const onChangeHandler = e => {
    const newValue = e.target.value;
    if (correct) {
      const value = answers[answerKey];

      let newCorrectAnswers = correctAnswers;

      newCorrectAnswers = newCorrectAnswers.map(answer =>
        answer === value ? newValue : answer
      );
      setCorrectAnswers(newCorrectAnswers);
    }
    setAnswers({ ...answers, [answerKey]: newValue });
  };

  const removeAnswer = () => {
    const newCorrect = correctAnswers.filter(
      answer => answer !== answers[answerKey]
    );

    setCorrectAnswers(newCorrect);

    let oldAnswers = answers;
    delete oldAnswers[answerKey];
    let newAnswerObject = {};

    const keys = Object.keys(oldAnswers);
    console.log(keys);

    for (let i = 0; i < keys.length; i++) {
      newAnswerObject[`answer${i + 1}`] = oldAnswers[keys[i]];
    }

    setAnswers(newAnswerObject);
    setCorrect(
      (newCorrect.length > 0 &&
        newCorrect.some(answer => answer === answers[answerKey])) ||
        false
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        value={answers[answerKey]}
        onChange={onChangeHandler}
        size='small'
        fullWidth
        margin='dense'
        sx={{ mr: '10px' }}
      />
      <FormControlLabel
        label='Correct'
        control={
          <Checkbox
            checked={correct}
            onChange={e => setCorrect(e.target.checked)}
          />
        }
      />
      <IconButton onClick={removeAnswer}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default QuestionAnswer;
