export const SAVE_USER = 'SAVE_USER';
export const GET_TOKEN_LOADING = 'GET_TOKEN_LOADING';
export const GET_TOKEN_ERROR = 'GET_TOKEN_ERROR';
export const GET_TOKEN_SUCCESS = 'GET_TOKEN_SUCESS';
export const SAVE_IMAGE = 'SAVE_IMAGE';

export const saveUser = (name, gravatarEmail) => ({
  type: SAVE_USER,
  payload: {
    name,
    gravatarEmail,
  },
});

const getTokenLoading = () => ({
  type: GET_TOKEN_LOADING,
});

const getTokenSuccess = (token) => ({
  type: GET_TOKEN_SUCCESS,
  payload: { token },
});

const getTokenError = (error) => ({
  type: GET_TOKEN_ERROR,
  payload: { error },
});

export const getTokenThunk = () => async (dispatch) => {
  dispatch(getTokenLoading());

  try {
    const url = 'https://opentdb.com/api_token.php?command=request';
    const response = await fetch(url);
    const data = await response.json();

    dispatch(getTokenSuccess(data.token));
  } catch (error) {
    dispatch(getTokenError(error));
  }
};
