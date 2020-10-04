/*eslint-disable*/
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { logOut } from '../../store/actions/authActions';

const Logout = ({ logOut }) => {
  useEffect(() => {
    logOut();
  }, []);

  return <Redirect to='/login' />;
};

export default connect(null, { logOut })(Logout);
