/*eslint-disable*/
import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './Components/Routing/PrivateRoutes';
import './App.less';
import Auth from './Components/Auth/Auth';
import { checkStatus } from './store/actions/authActions';
import Alert from './Components/Alert/Alert';
import HomePage from './Components/HomePage/HomePage';
import Logout from './Components/Auth/Logout';
import NotFound from './Components/UI/NotFound/NotFound';

const App = ({ alert, checkStatus }) => {
  useEffect(() => {
    checkStatus();
  }, []);
  return (
    <Fragment>
      {alert.length > 0 && (
        <div className='alert__container'>
          {alert.map(al => (
            <Alert key={al.id} message={al.message} type={al.type} />
          ))}
        </div>
      )}
      <Switch>
        <Route path='/login' exact component={Auth} />
        <PrivateRoute path='/posts/:postId' exact component={HomePage} />
        <PrivateRoute path='/posts' exact component={HomePage} />
        <Route path='/logout' component={Logout} />
        <Route exact path='/'>
          <Redirect to='/posts' />
        </Route>
        <Route path='*' component={NotFound} />
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  alert: state.alert
});

export default connect(mapStateToProps, { checkStatus })(App);
