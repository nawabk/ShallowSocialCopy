import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu, message, Modal } from 'antd';
import { EllipsisOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { storage } from '../../firebase-config';
import { deletePost } from '../../store/actions/postActions';

const { confirm } = Modal;
const EditPost = ({ deletePost, postId, imageName }) => {
  const [imageDeleted, setImageDelted] = useState(false);
  const [loading, setLoading] = useState(false);
  const deleteImage = () => {
    const desertRef = storage.ref().child(`images/${imageName}`);
    desertRef
      .delete()
      .then(function() {
        setImageDelted(true);
      })
      .catch(function(error) {
        if (error.code === 'storage/object-not-found') {
          return setImageDelted(true);
        }
        message.error('There is some problem while deleting your post', 3);
        setLoading(false);
      });
  };
  const deletePostHandler = () => {
    if (imageName) {
      confirm({
        title: 'Do you Want to delete this post?',
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          await deleteImage(postId);
        },
        onCancel() {}
      });
    } else {
      confirm({
        title: 'Do you Want to delete this post?',
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          await deletePost(postId);
        },
        onCancel() {}
      });
    }
  };
  useEffect(() => {
    if (imageDeleted) {
      deletePost(postId);
      setLoading(false);
    }
  }, [imageDeleted, deletePost, postId]);

  if (loading) {
    message.loading('Deleting twitt');
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={deletePostHandler}>Delete</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement='bottomRight'>
      <div className='twitt__edit' style={{ margin: '2rem' }}>
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
};

export default connect(null, { deletePost })(EditPost);
