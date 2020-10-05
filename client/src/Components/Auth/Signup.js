import React, { useState } from 'react';
import { connect } from 'react-redux';

import { setAlert } from '../../store/actions/alertActions';
import { onSignup } from '../../store/actions/authActions';

const Signup = ({ setAlert, onSignup, loginAccountClickHandler }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const formSubmitHandler = e => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return setAlert({
        message: 'Password Confirm do not match with password',
        type: 'danger'
      });
    }
    const userDetails = {
      name,
      email,
      password,
      passwordConfirm
    };
    onSignup(userDetails);
  };
  return (
    <form className='form' onSubmit={formSubmitHandler}>
      <h1>Create Account</h1>
      <div className='form__group'>
        <input
          type='text'
          className='form__control'
          placeholder=' '
          id='name'
          onChange={e => setName(e.target.value)}
          required
        />
        <label htmlFor='name' className='form__label'>
          <span>Name</span>
        </label>
      </div>
      <div className='form__group'>
        <input
          type='email'
          className='form__control'
          placeholder=' '
          onChange={e => setEmail(e.target.value)}
          id='email'
          required
        />
        <label htmlFor='email' className='form__label'>
          <span>Email</span>
        </label>
      </div>
      <div className='form__group'>
        <input
          type='password'
          className='form__control'
          placeholder=' '
          id='password'
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label htmlFor='password' className='form__label'>
          <span>Password</span>
        </label>
      </div>
      <div className='form__group'>
        <input
          type='password'
          className='form__control'
          placeholder=' '
          id='passwordConfirm'
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        <label htmlFor='passwordConfirm' className='form__label'>
          <span>Password Confirm</span>
        </label>
      </div>
      <button className='form__button'>Sign Up</button>
      <a href='!#' className='form__link' onClick={loginAccountClickHandler}>
        Login to your account
      </a>
    </form>
  );
};
export default connect(null, { setAlert, onSignup })(Signup);
