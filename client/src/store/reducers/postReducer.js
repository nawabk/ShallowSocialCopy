import {
  TWITTS_LIST_SAVE,
  TWITTS_ADD,
  TWITTS_ERROR,
  TWITTS_LOADING,
  TWITTS_LIKE,
  TWITTS_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  TWITT_DELETE,
  ASYNC_TASK_START,
  LOAD_TWITT
} from '../actions/actionTypes';

const initialState = {
  loading: false,
  list: [],
  loadedPost: null,
  error: null,
  status: false
};

function updateTwittComment(comments, commentId, description) {
  const modifiedComments = comments.map(comment => {
    if (comment._id === commentId) {
      const copyComment = { ...comment };
      copyComment.description = description;
      return copyComment;
    }
    return comment;
  });
  return modifiedComments;
}

function deleteTwittComment(comments, commentId) {
  return comments.filter(comment => comment._id !== commentId);
}

const reducer = (state = initialState, action) => {
  let loadedPostCopy = { ...state.loadedPost };
  switch (action.type) {
    case TWITTS_LOADING:
      return {
        ...state,
        loading: true,
        status: false
      };
    case ASYNC_TASK_START:
      return {
        ...state,
        status: false
      };
    case TWITTS_LIST_SAVE:
      return {
        ...state,
        loading: false,
        list: [...state.list, ...action.twitts]
      };
    case TWITTS_ADD:
      return {
        ...state,
        loading: false,
        list: [action.twitt, ...state.list],
        status: true
      };
    case LOAD_TWITT:
      return {
        ...state,
        loading: false,
        loadedPost: action.payload
      };
    case TWITTS_LIKE:
      const copyList = [...state.list];
      const idx = state.list.findIndex(item => item._id === action.twittId);
      const copyObj = copyList.filter(item => item._id === action.twittId)[0];
      let copyLikesArr = [...copyObj.likes];

      let loadedPostLikes = [];
      if (action.isLiking) {
        if (state.loadedPost && action.twittId === loadedPostCopy._id) {
          loadedPostLikes = [...loadedPostCopy.likes];
          loadedPostLikes.push(action.userId);
        }
        copyLikesArr.push(action.userId);
      } else {
        if (state.loadedPost && action.twittId === loadedPostCopy._id) {
          loadedPostLikes = [...loadedPostCopy.likes];
          loadedPostLikes = loadedPostLikes.filter(
            like => like !== action.userId
          );
          loadedPostCopy.likes = loadedPostLikes;
        }
        copyLikesArr = copyLikesArr.filter(like => like !== action.userId);
      }
      copyObj.likes = copyLikesArr;

      copyList[idx] = copyObj;
      return {
        ...state,
        loading: false,
        list: copyList,
        loadedPost: loadedPostCopy
      };
    case TWITTS_COMMENT:
      const index = state.list.findIndex(item => item._id === action.twittId);
      if (loadedPostCopy) {
        loadedPostCopy = action.updatedTwitt;
      }
      return {
        ...state,
        loading: false,
        status: true,
        list: Object.assign([...state.list], { [index]: action.updatedTwitt }),
        loadedPost: loadedPostCopy
      };
    case TWITTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        status: false
      };
    case UPDATE_COMMENT:
      if (loadedPostCopy && loadedPostCopy._id === action.twittId) {
        loadedPostCopy.comments = updateTwittComment(
          [...loadedPostCopy.comments],
          action.commentId,
          action.description
        );
      }
      return {
        ...state,
        status: true,
        list: state.list.map(post => {
          if (post._id === action.twittId) {
            const copyPost = { ...post };
            const copyComments = updateTwittComment(
              [...copyPost.comments],
              action.commentId,
              action.description
            );
            copyPost.comments = copyComments;
            return copyPost;
          }
          return post;
        }),
        loadedPost: loadedPostCopy
      };
    case DELETE_COMMENT:
      if (loadedPostCopy && loadedPostCopy._id === action.twittId) {
        loadedPostCopy.comments = deleteTwittComment(
          [...loadedPostCopy.comments],
          action.commentId
        );
      }
      return {
        ...state,
        list: state.list.map(post => {
          if (post._id === action.twittId) {
            const copyPost = { ...post };
            copyPost.comments = deleteTwittComment(
              [...copyPost.comments],
              action.commentId
            );
            return copyPost;
          }
          return post;
        }),
        loadedPost: loadedPostCopy
      };
    case TWITT_DELETE:
      return {
        ...state,
        list: state.list.filter(twitt => twitt._id !== action.twittId)
      };
    default:
      return state;
  }
};

export default reducer;
