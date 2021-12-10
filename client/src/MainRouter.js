import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { isAuthenticated } from './components/auth/auth-helper';
import Header from './components/Header';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import MentorDashboard from './components/mentor/MentorDashboard';
import QuizAdd from './components/mentor/QuizAdd';
import QuizEdit from './components/mentor/QuizEdit';
import QuizView from './components/mentor/QuizView';
import StudentDashboard from './components/student/StudentDashboard';
import Quiz from './components/student/Quiz';

const MainRouter = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [authenticated]);

  return (
    <div className='App' style={{ height: '100%', overflow: 'auto' }}>
      <Header
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
      />
      <div style={{ marginTop: '90px' }}>
        <Switch>
          <Route
            exact
            path='/'
            component={() => <Login setAuthenticated={setAuthenticated} />}
          />
          <PrivateRoute
            exact
            path='/mentor_dashboard'
            component={MentorDashboard}
          />
          <PrivateRoute exact path='/newQuiz' component={QuizAdd} />
          <PrivateRoute exact path='/quiz/edit/:id' component={QuizEdit} />
          <PrivateRoute exact path='/quiz/view/:id' component={QuizView} />
          <PrivateRoute
            exact
            path='/student_dashboard'
            component={StudentDashboard}
          />
          <PrivateRoute exact path='/quiz/solve/:id' component={Quiz} />
        </Switch>
      </div>
    </div>
  );
};

export default MainRouter;
