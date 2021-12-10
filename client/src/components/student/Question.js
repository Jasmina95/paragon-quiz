import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Answer from './Answer';

const Question = ( { answers, setAnswers, question, questionInd }) => {
  return (
    <Box>
      <Typography variant='subtitle1'>
        {questionInd + 1}. {question.question}
      </Typography>
      <Box sx={{ display: 'flex', ml: '10px' }}>
        <Box sx={{ width: '60%' }}>
          {answers &&
            question.answers &&
            question.answers.length > 0 &&
            question.answers.map((answer, ind) => (
              <Answer
                key={ind}
                answerInd={ind}
                questionInd={questionInd}
                answer={answer}
                setAnswers={setAnswers}
                answers={answers}
              />
            ))}
        </Box>
        <Box sx={{ width: '40%', textAlign: 'center' }}>
          {question.image && (
            <img
              src={`${process.env.PUBLIC_URL}/images/${question?.image}`}
              alt='questionImage'
              style={{ maxHeight: '100px', maxWidth: '100%' }}
            />
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: '15px' }} />
    </Box>
  );
};

export default Question;
