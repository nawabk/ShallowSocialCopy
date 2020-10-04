import {
  AUTH_SUCCESS,
  AUTH_LOADING,
  AUTH_FAIL,
  AUTH_LOGOUT,
  NO_AUTH
} from '../actions/actionTypes';

const initialState = {
  validatingAuth: true,
  token: null,
  user: {},
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.data.token,
        user: action.data.user,
        validatingAuth: false
      };
    case AUTH_FAIL:
      return {
        ...state,
        loading: false,
        err: action.err,
        validatingAuth: false
      };
    case NO_AUTH:
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        user: {},
        loading: false,
        error: null,
        validatingAuth: false
      };
    default:
      return state;
  }
};

export default authReducer;
