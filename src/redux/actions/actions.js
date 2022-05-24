export const SAVE_USER = 'SAVE_USER';

export const saveuser = (name, gravatarEmail) => ({
  type: SAVE_USER,
  payload: {
    name,
    gravatarEmail,
  },
});
