import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  NOTIFICATION_ERROR,
  NOTIFICATION_LOADING,
  MARK_ALLREAD_NOTIFICATION
} from '../actions/actionTypes';

const initialState = {
  list: [],
  loading: true,
  error: null
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        list: action.payload
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        list: [action.payload, ...state.list]
      };
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        list: state.list.map(notification => {
          if (notification._id === action.payload._id) {
            return action.payload;
          } else return notification;
        })
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        list: state.list.filter(
          notification => notification._id !== action.payload
        )
      };
    case MARK_ALLREAD_NOTIFICATION:
      return {
        ...state,
        list: state.list.map(li => {
          if (!li.isRead) li.isRead = true;
          return li;
        })
      };
    case NOTIFICATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
