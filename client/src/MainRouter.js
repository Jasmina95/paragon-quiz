import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { isAuthenticated } from './components/auth/auth-helper';
import Header from './components/Header';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import MentorDashboard from './components/mentor/MentorDashboard';
import QuizAdd from './components/mentor/QuizAdd';

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
      <div style={{ marginTop: '100px' }}>
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
        </Switch>
      </div>
    </div>
  );
};

export default MainRouter;
