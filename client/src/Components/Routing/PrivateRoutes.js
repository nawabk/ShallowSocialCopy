import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import PageLayout from '../Layout/PageLayout';

const PrivateRoutes = ({
  validatingAuth,
  component: Component,
  isAuthenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !validatingAuth ? (
          isAuthenticated ? (
            <PageLayout>
              <Component {...props} />
            </PageLayout>
          ) : (
            <Redirect to='/login' />
          )
        ) : (
          <Fragment />
        )
      }
    />
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  validatingAuth: state.auth.validatingAuth
});

export default connect(mapStateToProps, null)(PrivateRoutes);
