import * as uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './actionTypes';

export const setAlert = alert => {
  alert.id = uuid.v4();
  return dispatch => {
    dispatch({
      type: SET_ALERT,
      alert: alert
    });

    setTimeout(
      () =>
        dispatch({
          type: REMOVE_ALERT,
          id: alert.id
        }),
      5000
    );
  };
};
