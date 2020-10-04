import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

import BlankBox from '../UI/BlankBox/BlankBox';
import { avatarNameConvertetr } from '../../shared/Common';

const UserProfile = ({ name, following, followers }) => (
  <BlankBox>
    <div className='userprofile__header'></div>
    <div className='userprofile__content'>
      <Avatar
        style={{
          backgroundColor: '#ff6000',
          verticalAlign: 'middle',
          marginTop: '-2rem'
        }}
      >
        {avatarNameConvertetr(name)}
      </Avatar>
      <h3>{name}</h3>
      <h4 style={{ color: '#6c757d' }}>
        <EnvironmentOutlined style={{ marginRight: '.5rem' }} />
        Bangalore,India
      </h4>
      <Divider />
      <p className='userprofile__info'>
        <a href='#!'>Followers</a> : {followers}
      </p>
      <p className='userprofile__info'>
        <a href='#!'>Followings</a> : {following}
      </p>
    </div>
  </BlankBox>
);

const mapStateToProps = state => ({
  name: state.auth.user.name,
  followers: state.auth.user.followers.length,
  following: state.auth.user.following.length
});
export default connect(mapStateToProps)(UserProfile);
