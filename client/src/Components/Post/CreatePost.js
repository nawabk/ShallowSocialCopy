/*eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Card, Divider, Button, message, Tooltip, Modal } from 'antd';
import { FormOutlined, CameraOutlined } from '@ant-design/icons';
import { storage } from '../../firebase-config';

import { createTwitt } from '../../store/actions/postActions';
import { setAlert } from '../../store/actions/alertActions';

const CreatePost = ({ createTwitt, setAlert, success }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');
  const [progress, setProgress] = useState(0);
  const [imageName, setImageName] = useState('');
  const [imageData, setImageData] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInput = useRef();

  const addPostHandler = () => {
    if (!description && !file) {
      return message.warn(
        'Please write something or upload photo to create a post',
        5
      );
    }
    if (file) {
      uploadImage();
    } else {
      const body = {
        description
      };
      createTwittAsync(body);
    }
  };
  const createTwittAsync = async body => {
    await createTwitt(body);
  };

  useEffect(() => {
    if (success) {
      setPreview(null);
      setFile(null);
      setDescription('');
      setImageData('');
      setImageName('');
    }
  }, [success]);
  useEffect(() => {
    if (imageName && imageData) {
      const body = {
        description,
        imageName,
        imageData
      };
      createTwittAsync(body);
    }
  }, [imageName, imageData]);

  const imageChangeHandler = e => {
    const file = e.target.files[0];
    if (file.type && file.type.split('/')[0] !== 'image') {
      return message.error(
        'The selected file is not image.Please try uploading an image',
        5
      );
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };
  const uploadImage = () => {
    let currentImageName = `firebase-image-${Date.now()}`;
    let uploadImage = storage.ref(`images/${currentImageName}`).put(file);
    uploadImage.on(
      'state_changed',
      snapshot => {
        const progress = Math.round(
          (snapshot.byteTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        setLoading(true);
      },
      error => {
        setAlert({
          message: 'There is some problem uploading image.Please try later.',
          type: 'error'
        });
        setDescription('');
      },
      async () => {
        const url = await storage
          .ref('images')
          .child(currentImageName)
          .getDownloadURL();
        setImageData(url);
        setImageName(currentImageName);
      }
    );
  };

  const modalCloseHandler = () => {
    setPreview(null);
    setFile(null);
  };

  const modal = (
    <Modal
      title='Post'
      visible={preview}
      onCancel={modalCloseHandler}
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      <div className='post-modal'>
        <textarea
          placeholder='Say something about...'
          className='post-modal__textarea'
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
        <img src={preview} alt='Preview Image' className='post__image' />
        <div className='post-modal__actions'>
          <Button
            type='ghost'
            style={{ marginRight: '.5rem' }}
            onClick={modalCloseHandler}
          >
            Cancel
          </Button>
          <Button type='primary' onClick={addPostHandler}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <Card
      className='post__card'
      title='Create Post'
      size='small'
      type='inner'
      bodyStyle={{ padding: '5px' }}
    >
      <div className='post__create'>
        {/* {file && (
          <img
            src={preview}
            alt='Preview Image'
            className='post__image'
            height='200'
            width='250'
          />
        )} */}
        {modal}
        <textarea
          placeholder='Write somethig here...'
          rows='5'
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
      </div>
      <Divider style={{ marginTop: '0' }} />
      <div className='post__footer'>
        <Tooltip title='Upload image' placement='top'>
          <CameraOutlined
            className='post__camera'
            onClick={() => fileInput.current.click()}
          />
          <input
            type='file'
            hidden
            ref={fileInput}
            onChange={imageChangeHandler}
          />
        </Tooltip>

        <Button icon={<FormOutlined />} type='primary' onClick={addPostHandler}>
          Post
        </Button>
      </div>
    </Card>
  );
};
const mapStateToProps = state => ({
  success: state.post.status
});
export default connect(mapStateToProps, { createTwitt, setAlert })(CreatePost);
