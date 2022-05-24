import {
  SAVE_USER,
  GET_TOKEN_ERROR,
  GET_TOKEN_LOADING,
  GET_TOKEN_SUCCESS,
} from '../actions/actions';

const INITIAL_STATE = {
  name: '',
  assertions: '',
  score: 0,
  gravatarEmail: '',
  token: '',
  isFetching: false,
  error: '',
};

const player = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_USER:
    return {
      ...state,
      name: action.payload.name,
      gravatarEmail: action.payload.gravatarEmail,
    };
  case GET_TOKEN_LOADING:
    return {
      ...state,
      isFetching: true,
    };
  case GET_TOKEN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      token: action.payload.token,
    };
  case GET_TOKEN_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.payload.error,
    };
  default:
    return state;
  }
};

export default player;
