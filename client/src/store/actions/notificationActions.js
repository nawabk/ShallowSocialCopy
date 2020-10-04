import axios from 'axios';
import { API_URL, getAuthHeader } from '../../shared/Common';
import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  NOTIFICATION_ERROR,
  MARK_ALLREAD_NOTIFICATION
} from './actionTypes';

export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get(`${API_URL}/notifications`, getAuthHeader());
    dispatch({
      type: GET_NOTIFICATIONS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err
    });
  }
};

export const addNotification = notification => async dispatch => {
  if (notification) {
    dispatch({
      type: ADD_NOTIFICATION,
      payload: notification
    });
  }
};

export const updateNotification = notification => async dispatch => {
  if (notification) {
    dispatch({
      type: UPDATE_NOTIFICATION,
      payload: notification
    });
  }
};

export const deleteNotification = notificationId => async dispatch => {
  dispatch({
    type: DELETE_NOTIFICATION,
    payload: notificationId
  });
};

export const markAllAsRead = () => async dispatch => {
  try {
    await axios.put(
      `${API_URL}/notifications/markAllRead`,
      {},
      getAuthHeader()
    );
    dispatch({
      type: MARK_ALLREAD_NOTIFICATION
    });
  } catch (err) {
    dispatch({
      type: NOTIFICATION_ERROR,
      payload: err
    });
  }
};
