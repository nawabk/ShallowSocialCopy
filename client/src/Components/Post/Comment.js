import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Avatar, Input, Button, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

import { avatarNameConvertetr } from '../../shared/Common';
import { updateComment, deleteComment } from '../../store/actions/postActions';

const { confirm } = Modal;
const Comment = ({
  commentId,
  commentedBy,
  description,
  editable,
  updateComment,
  deleteComment,
  postId,
  status
}) => {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(description);
  const commentChangeHandler = e => {
    setDesc(e.target.value);
  };
  const checkClickHandler = () => {
    const body = {
      description: desc
    };
    updateComment(postId, commentId, body);
  };

  const deleteClickHandler = () => {
    confirm({
      title: 'Do you Want to delete this comment?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteComment(postId, commentId);
      },
      onCancel() {}
    });
  };

  useEffect(() => {
    if (status) {
      setEditing(false);
    }
  }, [status]);
  return (
    <div className='comment'>
      <Avatar
        style={{
          backgroundColor: '#ff6000',
          verticalAlign: 'middle'
        }}
      >
        {avatarNameConvertetr(commentedBy)}
      </Avatar>
      <div className='comment__content'>
        <h4 className='comment__by'>{commentedBy}</h4>
        {!editing ? (
          <p className='comment__description'>{description}</p>
        ) : (
          <Input
            placeholder='Add a comment'
            onChange={commentChangeHandler}
            value={desc}
            className='comments__input'
            onPressEnter={checkClickHandler}
          />
        )}

        {editable && (
          <>
            {!editing ? (
              <div className='comment__link'>
                <Button
                  className='comment__edit'
                  onClick={() => setEditing(true)}
                  icon={<EditOutlined />}
                  size='small'
                  type='link'
                  disabled={editing}
                />
                <Button
                  className='comment__delete'
                  icon={<DeleteOutlined />}
                  size='small'
                  type='link'
                  disabled={editing}
                  onClick={deleteClickHandler}
                />{' '}
              </div>
            ) : (
              <div className='comment__decision'>
                <Button
                  size='small'
                  shape='circle'
                  type='primary'
                  icon={<CheckOutlined />}
                  onClick={checkClickHandler}
                />
                <Button
                  size='small'
                  shape='circle'
                  type='danger'
                  icon={<CloseOutlined />}
                  onClick={() => setEditing(false)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  status: state.post.status
});
export default connect(mapStateToProps, { updateComment, deleteComment })(
  Comment
);
