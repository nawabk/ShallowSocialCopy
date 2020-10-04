import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Login from './Login';
import Progress from '../UI/Progress/Progress';

const Auth = ({ isAuthenticated, loading }) => {
  if (isAuthenticated) return <Redirect to='/posts' />;
  return (
    <>
      <Progress isAnimating={loading} />
      <div className='form-container'>
        <Login />
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.auth.loading
  };
};

export default connect(mapStateToProps, null)(Auth);
