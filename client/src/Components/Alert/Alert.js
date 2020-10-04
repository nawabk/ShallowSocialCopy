import React from 'react';
import { Alert } from 'antd';

const PageAlert = ({ message, type }) => (
  <div className='alert__top-right'>
    <Alert
      message={type === 'error' ? 'Error' : 'Success'}
      description={message}
      type={type}
      showIcon
      closable
    />
  </div>
);

export default PageAlert;
