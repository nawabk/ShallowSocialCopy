import React, { useState } from 'react';
import { connect } from 'react-redux';

import { setAlert } from '../../store/actions/alertActions';
import { onSignup } from '../../store/actions/authActions';

const Signup = ({ setAlert, onSignup }) => {
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
          placeholder='Name'
          id='name'
          onChange={e => setName(e.target.value)}
          required
        />
        <label htmlFor='name' className='form__label'>
          Email
        </label>
      </div>
      <div className='form__group'>
        <input
          type='email'
          className='form__control'
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}
          id='email'
          required
        />
        <label htmlFor='email' className='form__label'>
          Email
        </label>
      </div>
      <div className='form__group'>
        <input
          type='password'
          className='form__control'
          placeholder='Password'
          id='password'
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label htmlFor='password' className='form__label'>
          Password
        </label>
      </div>
      <div className='form__group'>
        <input
          type='password'
          className='form__control'
          placeholder='Password Confirm'
          id='passwordConfirm'
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        <label htmlFor='passwordConfirm' className='form__label'>
          Passwor Confirm
        </label>
      </div>
      <button className='form__button'>Sign Up</button>
    </form>
  );
};
export default connect(null, { setAlert, onSignup })(Signup);
