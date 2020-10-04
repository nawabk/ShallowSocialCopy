import React, { useEffect } from 'react';
import { Layout } from 'antd';
import socketIoClient from 'socket.io-client';

import TopBar from './TopBar';
import { connect } from 'react-redux';
import { SOCKET } from '../../shared/Common';
import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
} from '../../store/actions/notificationActions';

const { Content } = Layout;
const PageLayout = ({
  children,
  user,
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
}) => {
  useEffect(() => {
    if (user) {
      const socket = socketIoClient(SOCKET);
      socket.emit('newUserConnection', user._id);
      socket.on('notification', notification => {
        addNotification(notification);
      });
      socket.on('updateNotification', notification => {
        updateNotification(notification);
      });
      socket.on('deleteNotification', notificationId => {
        deleteNotification(notificationId);
      });
    }
  }, [user, addNotification, updateNotification, deleteNotification]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <Layout className='layout'>
      <TopBar />
      <Content style={{ padding: '40px 50px' }}>
        <div className='site-layout-content'>{children}</div>
      </Content>
    </Layout>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
})(PageLayout);
