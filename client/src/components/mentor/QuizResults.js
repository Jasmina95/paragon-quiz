import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getStudentScores } from '../api-quiz';
import { isAuthenticated } from '../auth/auth-helper';
import { Table, TableHead, TableBody, TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';

const getDateAndTime = date => {
  const newDate = date.split('T')[0].split('-');

  return `${newDate[2]}.${newDate[1]}.${newDate[0]}`;
};

const QuizResults = ({ match }) => {
  const [students, setStudents] = useState([]);
  const _isMounted = useRef(true);

  const history = useHistory();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getStudentScores(match.params.id, isAuthenticated()).then(data => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        if (_isMounted.current) {
          setStudents(data);
        }
      }
    });
  }, [match.params.id]);

  return (
    <Box sx={{ width: '90%', margin: 'auto' }}>
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant='contained'
          onClick={() => history.push('/mentor_dashboard')}
        >
          Back to dashboard
        </Button>
      </Box>
      <Typography variant='h6'>Results</Typography>
      <Table sx={{ mt: '20px' }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#EEEEEE' }}>
            <TableCell align='center'>First Name</TableCell>
            <TableCell align='center'>Last Name</TableCell>
            <TableCell align='center'>Score</TableCell>
            <TableCell align='center'>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students &&
            students.length > 0 &&
            students.map((student, ind) => (
              <TableRow key={ind}>
                <TableCell align='center'>{student.firstName}</TableCell>
                <TableCell align='center'>{student.lastName}</TableCell>
                <TableCell align='center'>
                  {student.quizzes &&
                    student.quizzes.length > 0 &&
                    student.quizzes
                      .filter(
                        ({ quizId }) => quizId === parseInt(match.params.id)
                      )[0]
                      .scores.map(({ score }, idx) => (
                        <Box key={idx}>
                          {score} /{' '}
                          {
                            student.quizzes.filter(
                              ({ quizId }) =>
                                quizId === parseInt(match.params.id)
                            )[0].answers.length
                          }
                        </Box>
                      ))}
                </TableCell>
                <TableCell align='center'>
                  {student.quizzes &&
                    student.quizzes.length > 0 &&
                    student.quizzes
                      .filter(
                        ({ quizId }) => quizId === parseInt(match.params.id)
                      )[0]
                      .scores.map(({ date }, idx) => (
                        <Box key={idx}>{getDateAndTime(date)}</Box>
                      ))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default QuizResults;
