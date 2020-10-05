import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Login from './Login';
import Signup from './Signup';
import Progress from '../UI/Progress/Progress';
import { notification } from 'antd';

const Auth = ({ isAuthenticated, loading }) => {
  const [isSignin, setIsSignin] = useState(true);
  useEffect(() => {
    notification.open({
      message: 'Login Credentials',
      description:
        "Hey there!You can use mdkhalid@gmail.com(email) and test@1234(password) to login or you can create your account.Don't need to provide your original email just make sure the email should end with .com",
      onClick: () => {
        console.log('Notification Clicked!');
      },
      duration: 0
    });
    return () => {
      notification.destroy();
    };
  }, []);
  if (isAuthenticated) return <Redirect to='/posts' />;

  return (
    <>
      <Progress isAnimating={loading} />
      <div className='form-container'>
        {isSignin ? (
          <Login createAccountClickHandler={() => setIsSignin(false)} />
        ) : (
          <Signup loginAccountClickHandler={() => setIsSignin(true)} />
        )}
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
