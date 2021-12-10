import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Answer = ({ answer, answerInd, questionInd, setAnswers, answers }) => {
  const [checked, setChecked] = useState(
    answers[`question${questionInd + 1}`][`answer${answerInd + 1}`].selected
  );

  useEffect(() => {
    setAnswers({
      ...answers,
      [`question${questionInd + 1}`]: {
        ...answers[`question${questionInd + 1}`],
        [`answer${answerInd + 1}`]: {
          ...answers[`question${questionInd + 1}`][`answer${answerInd + 1}`],
          selected: checked
        }
      }
    });
  }, [checked]);

  return (
    <FormControlLabel
      label={answer}
      sx={{ width: '100%' }}
      control={
        <Checkbox
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
      }
    />
  );
};

export default Answer;
