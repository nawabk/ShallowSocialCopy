import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { onLogin } from '../../store/actions/authActions';

const Login = ({ onLogin, loading, createAccountClickHandler }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const formSubmitHanlder = e => {
    e.preventDefault();
    onLogin(email, password);
  };
  return (
    <form className='form' onSubmit={formSubmitHanlder}>
      <h1>Sign In</h1>
      <div className='form__group'>
        <input
          type='email'
          className='form__control'
          id='email'
          required
          placeholder=' '
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor='email' className='form__label'>
          <span>Email</span>
        </label>
      </div>
      <div className='form__group'>
        <input
          type='password'
          className='form__control'
          id='password'
          required
          placeholder=' '
          onChange={e => setPassword(e.target.value)}
        />
        <label htmlFor='password' className='form__label'>
          <span>Password</span>
        </label>
      </div>
      <Button type='primary' htmlType='submit' disabled={loading}>
        Sign In
      </Button>
      <a href='#!' className='form__link' onClick={createAccountClickHandler}>
        Create Your Account
      </a>
    </form>
  );
};

const mapStateToProps = state => ({
  loading: state.auth.loading
});

export default connect(mapStateToProps, { onLogin })(Login);
