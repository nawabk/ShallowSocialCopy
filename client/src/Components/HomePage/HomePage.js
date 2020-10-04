import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'antd';

import UserProfile from '../User/UserProfile';
import CreatePost from '../Post/CreatePost';
import Posts from '../Post/Posts';
import Post from '../Post/Post';
import { fetchSingleTwitt } from '../../store/actions/postActions';

const HomePage = ({
  match,
  loadedPost,
  loggedInUser,
  loading,
  history,
  fetchSingleTwitt
}) => {
  useEffect(() => {
    if (match.params.postId) {
      fetchSingleTwitt(match.params.postId);
    }
  }, [fetchSingleTwitt, match]);

  const isLikedByLoggedInUser = likes => {
    if (loggedInUser) {
      let flag = false;
      likes.forEach(like => {
        if (like === loggedInUser._id) {
          flag = true;
          return;
        }
      });
      if (flag) return true;
      else return false;
    }
  };

  const canEditPost = createdBy => {
    if (createdBy === loggedInUser._id) return true;
    else return false;
  };

  return (
    <Row>
      <Col span={2}></Col>
      <Col span={5}>
        <UserProfile />
      </Col>
      <Col span={12}>
        {!match.params.postId ? (
          <>
            {' '}
            <CreatePost />
            <Posts />
          </>
        ) : (
          loadedPost &&
          Object.keys(loadedPost).length > 0 && (
            <Post
              imageData={loadedPost.imageData && loadedPost.imageData}
              createdBy={
                loadedPost.createdBy.name
                  ? loadedPost.createdBy.name
                  : loggedInUser.name
              }
              createdOn={loadedPost.createdOn}
              twittText={loadedPost.description}
              noOfLikes={loadedPost.likes.length}
              noOfComments={loadedPost.comments.length}
              liked={isLikedByLoggedInUser(loadedPost.likes)}
              postId={loadedPost._id}
              comments={loadedPost.comments}
              userId={loggedInUser._id}
              canEdit={canEditPost(
                !loadedPost.createdBy._id
                  ? loadedPost.createdBy
                  : loadedPost.createdBy._id
              )}
              imageName={loadedPost.imageName}
            />
          )
        )}
      </Col>
      {match.params.postId && (
        <Col span={5}>
          <Button
            style={{ margin: '1rem' }}
            onClick={() => history.push('/posts')}
          >
            Go Back
          </Button>
        </Col>
      )}
    </Row>
  );
};

const mapStateToProps = state => ({
  loadedPost: state.post.loadedPost,
  loading: state.post.loading,
  loggedInUser: state.auth.user
});

export default connect(mapStateToProps, { fetchSingleTwitt })(HomePage);
