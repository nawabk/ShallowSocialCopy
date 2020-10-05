import {
  TWITTS_LIST_SAVE,
  TWITTS_ADD,
  TWITTS_LOADING,
  TWITTS_ERROR,
  TWITTS_LIKE,
  TWITTS_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  TWITT_DELETE,
  ASYNC_TASK_START,
  LOAD_TWITT
} from './actionTypes';
import axios from 'axios';
import { setAlert } from './alertActions';
import { getAuthHeader, API_URL } from '../../shared/Common';
import { message } from 'antd';

export const fetchAllTwitts = (pageNumber, callback) => async dispatch => {
  try {
    const config = getAuthHeader();
    const res = await axios.get(
      `${API_URL}/twitts?page=${pageNumber}&limit=20`,
      config
    );
    dispatch({
      type: TWITTS_LOADING
    });
    dispatch({
      type: TWITTS_LIST_SAVE,
      twitts: res.data.twitts
    });
    if (res.data.twitts.length > 0) callback(true);
    else callback(false);
  } catch (err) {
    dispatch(
      setAlert({
        message: 'Problem fetching twitts...Pleas try later.',
        type: 'error'
      })
    );
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};

export const fetchSingleTwitt = postId => async dispatch => {
  dispatch({
    type: TWITTS_LOADING
  });
  try {
    const res = await axios.get(`${API_URL}/twitts/${postId}`, getAuthHeader());
    dispatch({
      type: LOAD_TWITT,
      payload: res.data
    });
  } catch (err) {
    dispatch(
      setAlert({
        type: 'error',
        message: 'There is problem while fetching post'
      })
    );
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};

export const createTwitt = body => async dispatch => {
  dispatch({
    type: TWITTS_LOADING
  });
  try {
    const config = getAuthHeader();
    const res = await axios.post(`${API_URL}/twitts`, body, config);
    dispatch({
      type: TWITTS_ADD,
      twitt: res.data.twitt
    });
  } catch (err) {
    dispatch(
      setAlert({
        message: 'Problem while posting twitt....please try later.',
        type: 'error'
      })
    );
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};

export const likeTwitt = (twittId, userId, isLiking) => async dispatch => {
  dispatch({
    type: TWITTS_LOADING
  });
  try {
    const config = getAuthHeader();
    await axios.patch(`${API_URL}/twitts/${twittId}/like`, null, config);
    dispatch({
      type: TWITTS_LIKE,
      twittId,
      userId,
      isLiking
    });
  } catch (err) {
    dispatch(
      setAlert({
        message: 'There is some problem with server....please try later',
        type: 'error'
      })
    );
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};
export const commentTwitt = (twittId, body) => async dispatch => {
  dispatch({
    type: ASYNC_TASK_START
  });
  try {
    const config = getAuthHeader();
    const res = await axios.patch(
      `${API_URL}/twitts/${twittId}/comment`,
      body,
      config
    );

    dispatch({
      type: TWITTS_COMMENT,
      twittId,
      updatedTwitt: res.data.twitt
    });
  } catch (err) {
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};

export const updateComment = (twittId, commentId, body) => async dispatch => {
  dispatch({
    type: ASYNC_TASK_START
  });
  const { description } = body;
  try {
    const config = getAuthHeader();
    await axios.patch(
      `${API_URL}/twitts/${twittId}/comment/${commentId}`,
      body,
      config
    );
    message.success('Comment updated successfully', 3);
    dispatch({
      type: UPDATE_COMMENT,
      twittId,
      commentId,
      description
    });
  } catch (err) {
    dispatch({
      type: TWITTS_ERROR
    });
  }
};

export const deleteComment = (twittId, commentId) => async dispatch => {
  try {
    const config = getAuthHeader();
    await axios.delete(
      `${API_URL}/twitts/${twittId}/comment/${commentId}`,
      config
    );
    dispatch({
      type: DELETE_COMMENT,
      twittId,
      commentId
    });
  } catch (err) {
    dispatch({
      type: TWITTS_ERROR
    });
  }
};

export const deletePost = twittId => async dispatch => {
  dispatch({
    type: ASYNC_TASK_START
  });
  try {
    const config = getAuthHeader();
    await axios.delete(`${API_URL}/twitts/${twittId}`, config);
    dispatch({
      type: TWITT_DELETE,
      twittId
    });
  } catch (err) {
    dispatch({
      type: TWITTS_ERROR,
      error: err.response
    });
  }
};
