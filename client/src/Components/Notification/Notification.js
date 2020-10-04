import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Popover, Button, Badge, List } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { markAllAsRead } from '../../store/actions/notificationActions';

const Notification = ({ notifications, markAllAsRead, history }) => {
  const [unreadNotification, setUnreadNotification] = useState(0);
  const [data, setData] = useState([]);
  useEffect(() => {
    let count = 0;
    const data = [];
    notifications.forEach(notification => {
      if (!notification.isRead) {
        count++;
      }
      data.push({ title: notification.title, postId: notification.postId });
    });
    setUnreadNotification(count);
    setData(data);
  }, [notifications]);

  const content = data.length > 0 && (
    <List
      bordered
      dataSource={data}
      renderItem={item => (
        <List.Item
          className='notification__list'
          onClick={() => history.push(`/posts/${item.postId}`)}
        >
          {item.title}
        </List.Item>
      )}
    />
  );

  const notifyIconClickHandler = () => {
    if (unreadNotification > 0) markAllAsRead();
  };

  return (
    <Popover
      content={content}
      placement='bottom'
      trigger='click'
      onClick={notifyIconClickHandler}
    >
      {unreadNotification > 0 ? (
        <Badge count={unreadNotification}>
          <Button
            shape='circle'
            className='notification__button'
            icon={<NotificationOutlined />}
            size='large'
            style={{ background: '#fadb14' }}
          />
        </Badge>
      ) : (
        <Button
          shape='circle'
          className='notification__button'
          icon={<NotificationOutlined />}
          size='large'
          style={{ background: '#fadb14' }}
        />
      )}
    </Popover>
  );
};

const mapStateToProps = state => ({
  notifications: state.notification.list
});

export default connect(mapStateToProps, { markAllAsRead })(
  withRouter(Notification)
);
