import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import QuestionEdit from './QuestionEdit';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Question = ({ question, idx, values, setValues }) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const removeQuestion = () => {
    const newQuestions = values.questions.filter((_, ind) => ind !== idx);

    setValues({ ...values, questions: newQuestions });
  };

  return (
    <Box sx={{ ml: '2%', mt: '10px' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          {idx + 1}. {question.question}
        </Typography>
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => setOpenDelete(true)}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ ml: '3%', width: '45%' }}>
          {question.answers &&
            question.answers.length > 0 &&
            question.answers.map((answer, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '10px',
                    height: '10px',
                    border: '1px solid black',
                    borderRadius: '50%',
                    mr: '10px',
                    bgcolor: question?.correctAnswers.some(
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
          {question.file && (
            <img
              src={URL.createObjectURL(question.file)}
              alt='question'
              style={{ maxWidth: '100%', maxHeight: '150px' }}
            />
          )}
          {!question.file && question.image && (
            <img
              src={`${process.env.PUBLIC_URL}/images/${question.image}`}
              alt='question'
              style={{ maxWidth: '100%', maxHeight: '150px' }}
            />
          )}
        </Box>
      </Box>
      <Divider />
      <QuestionEdit
        values={values}
        setValues={setValues}
        open={open}
        setOpen={setOpen}
        oldQuestion={question}
        idx={idx}
      />
      <Dialog
        maxWidth='sm'
        fullWidth
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogContent>
          <Typography variant='subtitle1' align='justify'>
            This action cannot be undone. Are you sure you want to delete this
            Question?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={removeQuestion}
          >
            Yes
          </Button>
          <Button variant='contained' onClick={() => setOpenDelete(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Question;
