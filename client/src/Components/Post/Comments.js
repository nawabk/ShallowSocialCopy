import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Avatar, Input, Button, Divider } from 'antd';

import Comment from './Comment';
import { avatarNameConvertetr } from '../../shared/Common';
import { commentTwitt } from '../../store/actions/postActions';

const Comments = ({
  loggedInUserName,
  comments,
  commentTwitt,
  postId,
  loggedInUserId,
  status
}) => {
  const [description, setDescription] = useState('');
  const [showPostButton, setShowPostButton] = useState(false);

  useEffect(() => {
    if (status) {
      setDescription('');
      setShowPostButton(false);
    }
  }, [status]);
  const descriptionChangeHandler = e => {
    if (e.target.value === '') setShowPostButton(false);
    else setShowPostButton(true);
    setDescription(e.target.value);
  };
  const buttonClickHandler = () => {
    const body = {
      description
    };
    commentTwitt(postId, body);
  };
  const isCommentEditable = commentedBy => {
    return commentedBy === loggedInUserId;
  };
  return (
    <section className='comments'>
      <div className='comments__create'>
        <Avatar
          style={{
            backgroundColor: '#ff6000'
          }}
        >
          {avatarNameConvertetr(loggedInUserName)}
        </Avatar>
        <Input
          placeholder='Add a comment'
          onChange={descriptionChangeHandler}
          className='comments__input'
          value={description}
          onPressEnter={buttonClickHandler}
        />
        {/* <input
          type='text'
          placeholder='Add Comment'
          className='comments__input'
          onChange={e => setDescription(e.target.value)}
        /> */}
        {showPostButton && (
          <Button type='primary' size='small' onClick={buttonClickHandler}>
            Post
          </Button>
        )}
      </div>
      {comments.length > 0 && (
        <>
          <Divider style={{ margin: '10px 0' }} />
          <div className='comments__content'>
            {comments.map((comment, idx) => {
              return (
                <div key={comment._id}>
                  <Comment
                    commentId={comment._id}
                    commentedBy={comment.user.name}
                    description={comment.description}
                    editable={isCommentEditable(comment.user._id)}
                    postId={postId}
                  />
                  {idx !== comments.length - 1 && (
                    <Divider style={{ margin: '10px 0' }} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

const mapStateToProps = state => ({
  loggedInUserName: state.auth.user.name,
  loggedInUserId: state.auth.user._id,
  status: state.post.status
});
export default connect(mapStateToProps, { commentTwitt })(Comments);
