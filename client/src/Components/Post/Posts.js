/*eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import { fetchAllTwitts } from '../../store/actions/postActions';
import Post from './Post';

const Posts = ({ fetchAllTwitts, posts, name, loggedInUserId, loading }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    fetchAllTwitts(pageNumber, hasMore => {
      setHasMore(hasMore);
    });
  }, [pageNumber]);

  const observer = useRef();
  const lastPost = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  const isLikedByLoggedInUser = likes => {
    if (loggedInUserId) {
      let flag = false;
      likes.forEach(like => {
        if (like === loggedInUserId) {
          flag = true;
          return;
        }
      });
      if (flag) return true;
      else return false;
    }
  };

  const canEditPost = createdBy => {
    if (createdBy === loggedInUserId) return true;
    else return false;
  };
  return (
    posts.length > 0 &&
    posts.map((post, idx) => {
      if (idx + 1 === posts.length) {
        return (
          <div ref={lastPost} key={post._id}>
            <Post
              imageData={post.imageData && post.imageData}
              createdBy={post.createdBy.name ? post.createdBy.name : name}
              createdOn={post.createdOn}
              twittText={post.description}
              noOfLikes={post.likes.length}
              noOfComments={post.comments.length}
              liked={isLikedByLoggedInUser(post.likes)}
              postId={post._id}
              comments={post.comments}
              userId={loggedInUserId}
              canEdit={canEditPost(
                !post.createdBy._id ? post.createdBy : post.createdBy._id
              )}
              imageName={post.imageName}
            />
          </div>
        );
      } else {
        return (
          <Post
            ref={lastPost}
            key={post._id}
            imageData={post.imageData && post.imageData}
            createdBy={post.createdBy.name ? post.createdBy.name : name}
            createdOn={post.createdOn}
            twittText={post.description}
            noOfLikes={post.likes.length}
            noOfComments={post.comments.length}
            liked={isLikedByLoggedInUser(post.likes)}
            postId={post._id}
            comments={post.comments}
            userId={loggedInUserId}
            canEdit={canEditPost(
              !post.createdBy._id ? post.createdBy : post.createdBy._id
            )}
            imageName={post.imageName}
          />
        );
      }
    })
  );
};

const mapStateToProps = state => ({
  posts: state.post.list,
  name: state.auth.user.name,
  loggedInUserId: state.auth.user._id,
  loading: state.post.loading
});

export default connect(mapStateToProps, { fetchAllTwitts })(Posts);
