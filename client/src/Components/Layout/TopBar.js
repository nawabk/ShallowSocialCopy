import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

import { avatarNameConvertetr } from '../../shared/Common';
import Notification from '../Notification/Notification';

const { Header } = Layout;
const { SubMenu } = Menu;

const TopBar = ({ name, history }) => {
  const avatar = (
    <Avatar
      style={{
        backgroundColor: '#ff6000',
        verticalAlign: 'middle'
      }}
    >
      {avatarNameConvertetr(name)}
    </Avatar>
  );
  return (
    <Header style={{ width: '100%', zIndex: '2' }}>
      <div className='logo'>
        <h4>Shallow Social Copy</h4>
      </div>
      <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['2']}>
        {name && (
          <SubMenu icon={avatar} style={{ float: 'right' }}>
            <Menu.Item icon={<UserOutlined />}>{name}</Menu.Item>
            <Menu.Item
              icon={<LogoutOutlined />}
              onClick={() => history.push('/logout')}
            >
              Logout
            </Menu.Item>
          </SubMenu>
        )}
        <Menu.Item style={{ float: 'right', transform: 'translateY(5px)' }}>
          <Notification />
        </Menu.Item>
      </Menu>
    </Header>
  );
};

const mapStateToProps = state => ({
  name: state.auth.user.name
});
export default connect(mapStateToProps)(withRouter(TopBar));
