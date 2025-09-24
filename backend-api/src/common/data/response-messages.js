module.exports = {
  NO_SUCH_USER: { code: 403, message: 'No such user found' },
  LOGIN_FAIL: { code: 403, message: 'Invalid username or password' },
  INVALID_EXPIRED_TOKEN: { code: 403, message: 'Token Expired/Incorrect' },
  LOGIN_SUCCESS: { code: 200, message: 'Login successfull' },

  RECORD_FETCH_SUCCESS: { code: 200, message: 'Data fetched succesful' },
  RECORD_FETCH_NOT_FOUND: { code: 403, message: 'No data found' },

  RECORD_CREATE_SUCCESS: { code: 200, message: 'Data created  succesfull' },
  RECORD_CREATE_FAIL: { code: 403, message: 'Not able to create record' },

  RECORD_UPDATE_SUCCESS: { code: 200, message: 'Data updated  succesfull' },
  RECORD_UPDATE_FAIL: { code: 403, message: 'Not able to update record' },
  RECORD_ALREADY_EXISTS: { code: 403, message: 'Record already exists' },

  RECORD_DELETE_SUCCESS: { code: 200, message: 'Data deleted  succesfull' },
  TRANSACTION_CREATE_SUCCESS: { code: 200, message: 'Transaction created  succesfull' },

  ACCESS_DENIED: { code: 403, message: 'Access denied' },
  INVALID_TOKEN: { code: 401, message: 'Access denied, Invalid Token Provided' },
  MISSING_TOKEN: { code: 401, message: 'Access denied, Invalid Token Provided' },

  JOI_VALIDATION_ERROR: { code: 422, message: 'Parameters missing or Invalid values passed...!' },
  EMAIL_NOT_FOUND: { code: 403, message: 'Email Not Found...!' },

  INTERNAL_TRANSFER_CREATE_SUCCESS: { code: 200, message: 'Transfer Request was successfully created' },
  INTERNAL_TRANSFER_CREATE_FAIL: { code: 403, message: 'Transfer Request was not created' },
  INTERNAL_TRANSFER_REJECT_SUCCESS: { code: 200, message: 'Transfer Request was Rejected' },

  ACCOUNT_REQUEST_CREATE_SUCCESS: { code: 200, message: 'Account request was successfully created' },
  ACCOUNT_REQUEST_REJECT_SUCCESS: { code: 200, message: 'Account request was Rejected' },
  ACCOUNT_REQUEST_APPROVE_SUCCESS: { code: 200, message: 'Account request was APPROVED' },

  INTERNAL_TRANSFER_FAIL: { code: 403, message: 'Transfer was not successful' },

  GET_MT5_MARKUP_SUCCESS: { code: 200, message: 'Fetch MT5 Markup Successful' },
  INVALID_OLD_PASSWORD: { code: 403, message: 'Old Password is incorrect' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Internal server error' },
  LIMIT_EXCEEDED: { code: 403, message: 'Limit exceeded' },
};
