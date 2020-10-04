import React from 'react';

const Overlay = ({ addActiveContainer, removeActiveContainer }) => (
  <div className='overlay-container'>
    <div className='overlay'>
      <div className='overlay-panel overlay-left'>
        <h1>
          Welcome Back<i className='fa fa-twitter ml-1' aria-hidden='true'></i>
        </h1>
        <p>To Keep connected with us please login with your personal info</p>
        <button className='form__button ghost' onClick={removeActiveContainer}>
          Sign In
        </button>
      </div>
      <div className='overlay-panel overlay-right'>
        <h1>
          Twitter Clone<i className='fa fa-twitter ml-1' aria-hidden='true'></i>
        </h1>
        <p>Enter your personal details and start your journey with us</p>
        <button className='form__button ghost' onClick={addActiveContainer}>
          Sign Up
        </button>
      </div>
    </div>
  </div>
);

export default Overlay;
