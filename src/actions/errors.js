export const DISMISS_ERROR = 'DISMISS_ERROR';
export const DISMISS_ALL_ERRORS = 'DISMISS_ALL_ERRORS';
export const ERROR = 'ERROR';

export const dismiss = errorMessage => ({
  type: DISMISS_ERROR,
  errorMessage
});

export const dismissAll = () => ({
  type: DISMISS_ALL_ERRORS
});

export const errorCreator = error => ({
  type: ERROR,
  error
});
