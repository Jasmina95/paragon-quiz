import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { useHistory } from 'react-router-dom';

const getDateAndTime = date => {
  const newDate = date.split('T')[0].split('-');
  const time = date.split('T')[1].split(':');

  return `${newDate[2]}.${newDate[1]}.${newDate[0]}, ${time[0]}:${time[1]}`;
};

const QuizCard = ({ quiz }) => {
  const history = useHistory();

  return (
    <Card
      onClick={
        quiz.published
          ? () => history.push(`/quiz/view/${quiz._id}`)
          : () => history.push(`/quiz/edit/${quiz._id}`)
      }
      sx={{
        width: '300px',
        height: '425px',
        mr: '20px',
        mb: '30px',
        position: 'relative',
        '&:hover': { bgcolor: '#EEEEEE', cursor: 'pointer' }
      }}
    >
      <CardContent>
        <Typography variant='h6'>{quiz.quizName}</Typography>
        <Divider sx={{ mb: '10px' }} />
        <Typography variant='subtitle2' align='justify'>
          {quiz.quizDescription}
        </Typography>
        <Typography
          variant='subtitle1'
          align='justify'
          sx={{ position: 'absolute', bottom: 0 }}
        >
          {quiz.published
            ? `Published: ${getDateAndTime(quiz.publishedDate)}`
            : `Last modified: ${getDateAndTime(quiz.modifiedDate)}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
