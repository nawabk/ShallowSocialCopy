import { SET_ALERT, REMOVE_ALERT } from '../actions/actionTypes';

const initialState = [];
export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.alert];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== action.id);
    default:
      return state;
  }
};

export default alertReducer;
