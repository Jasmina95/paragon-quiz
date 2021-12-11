import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const Score = ({ open, setOpen, quiz, student }) => {
  const [quizResult, setQuizResult] = useState(null);
  const _isMounted = useRef(true);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  });

  useEffect(() => {
    if (student)
      setQuizResult(
        student.quizzes.filter(({ quizId }) => quizId === quiz._id)[0]
      );
  }, [student, quiz]);

  return (
    <Dialog maxWidth='md' fullWidth open={open} onClose={() => setOpen(false)}>
      <DialogContent sx={{ position: 'relative' }}>
        <Typography
          variant='h6'
          align='center'
          sx={{ color: quizResult?.status === 'passed' ? 'green' : 'red' }}
        >
          {quizResult?.status === 'passed'
            ? 'Congratulations, you passed the quiz!'
            : 'Unfortunately, you failed the quiz!'}
        </Typography>
        <Typography
          variant='h6'
          align='center'
          sx={{ color: quizResult?.status === 'passed' ? 'green' : 'red' }}
        >
          Score: {quizResult?.scores[quizResult?.scores.length - 1]?.score}/
          {quizResult?.answers.length}
        </Typography>
        {quiz &&
          quiz.questions &&
          quiz.questions.length > 0 &&
          quizResult &&
          quizResult.answers &&
          quiz.questions.map((question, index) => (
            <Box key={index} sx={{ mb: '20px' }}>
              <Typography variant='subtitle1'>{question.question}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ ml: '3%', width: '45%' }}>
                  {question.answers &&
                    question.answers.length > 0 &&
                    question.answers.map((answer, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Box
                          sx={{
                            width: '10px',
                            height: '10px',
                            border: '1px solid black',
                            borderRadius: '50%',
                            mr: '10px',
                            bgcolor: quizResult?.answers[index].answers.some(
                              correct => correct === answer
                            )
                              ? 'gray'
                              : 'white'
                          }}
                        />
                        <Typography variant='subtitle1'>{answer}</Typography>
                      </Box>
                    ))}
                </Box>
                <Box sx={{ width: '45%', textAlign: 'center' }}>
                  {question.image && (
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${question.image}`}
                      alt='question description'
                      style={{ maxWidth: '100%', maxHeight: '150px' }}
                    />
                  )}
                </Box>
              </Box>
              <Typography
                variant='subtitle1'
                sx={{
                  color: quizResult?.answers[index].correct ? 'green' : 'red'
                }}
              >
                {quizResult?.answers[index].correct ? 'Correct' : 'Incorrect'}
              </Typography>
              {(quizResult?.numberOfTries === 2 ||
                quizResult?.status === 'passed') &&
                !quizResult?.answers[index].correct && (
                  <Typography
                    variant='subtitle2'
                    sx={{
                      color: quizResult?.answers[index].correct
                        ? 'green'
                        : 'red'
                    }}
                  >
                    Correct Answer(s): {question.correctAnswers.join(', ')}
                  </Typography>
                )}
              <Divider />
            </Box>
          ))}
      </DialogContent>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: 'absolute', top: '5px', right: '20px' }}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
};

export default Score;
