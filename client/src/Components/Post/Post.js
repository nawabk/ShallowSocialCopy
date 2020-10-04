/*eslint-disable */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Card, Divider, Avatar } from 'antd';
import { LikeOutlined, CommentOutlined, LikeFilled } from '@ant-design/icons';

import { avatarNameConvertetr, calculateTimeElapse } from '../../shared/Common';
import { likeTwitt } from '../../store/actions/postActions';
import Comments from './Comments';
import EditPost from './EditPost';

const Post = ({
  twittText,
  createdBy,
  createdOn,
  noOfLikes,
  noOfComments,
  imageData,
  liked,
  postId,
  userId,
  likeTwitt,
  comments,
  canEdit,
  imageName
}) => {
  const likePostHandler = isLiking => {
    likeTwitt(postId, userId, isLiking);
  };
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Card bodyStyle={{ padding: '0' }} style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='twitt__details'>
          <Avatar size='large' style={{ backgroundColor: '#ff6000' }}>
            {avatarNameConvertetr(createdBy)}
          </Avatar>
          <div className='twitt__by'>
            <h3>{createdBy}</h3>
            <p>{calculateTimeElapse(createdOn)}</p>
          </div>
        </div>
        {canEdit && <EditPost postId={postId} imageName={imageName} />}
      </div>
      <div className='twitt__content-text'>
        <p>{twittText}</p>
      </div>
      {imageData && (
        <img
          src={imageData}
          alt='Loaded Image'
          className='twitt__content-img'
        />
      )}
      <Divider style={{ marginTop: '.2rem', marginBottom: '.2rem' }} />
      <div className='twitt__info'>
        {liked ? (
          <LikeFilled
            className='twitt__unlike-icon'
            onClick={() => likePostHandler(false)}
          />
        ) : (
          <LikeOutlined
            className='twitt__like-icon'
            onClick={() => likePostHandler(true)}
          />
        )}{' '}
        <span>&bull;</span>{' '}
        <span style={{ fontSize: '14px' }}>{noOfLikes}</span>
        <Divider type='vertical' />
        <CommentOutlined
          className='twitt__comment-icon'
          onClick={() => setCollapsed(!collapsed)}
        />{' '}
        <span>&bull;</span>{' '}
        <span style={{ fontSize: '14px' }}>{noOfComments}</span>
      </div>
      {collapsed && <Comments comments={comments} postId={postId} />}
    </Card>
  );
};

export default connect(null, { likeTwitt })(Post);
