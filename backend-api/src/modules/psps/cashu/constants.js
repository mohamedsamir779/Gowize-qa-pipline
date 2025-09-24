module.exports = {
  CASHU: 'CASHU',
  UNPAID: 'UNPAID'
}

module.exports.VIEW_CONTENT_CASHU_FAILED = {
  heading: 'Uh ho!',
  message: 'Cashu Payment Failed !',
  description: 'Your payment is failed, try again or use any other payment option.',
  tagline: '© 2020 Exinti Ltd',
};

module.exports.VIEW_CONTENT_CASHU_SUCCESS = {
  heading: 'Thank you!',
  message: 'Cashu Payment Successfull !',
  description: 'Your payment is successfull, please allow 1-2 business days to process.',
  tagline: '© 2020 Exiniti Ltd',
};

module.exports.CASHU_CODE_SUCCESS = {
  code: 200,
  type: 'CASHU_CODE_SUCCESS',
  message: 'Cashu transaction code successfully generated.',
};

module.exports.CASHU_CODE_ERROR = {
  code: 500,
  type: 'CASHU_CODE_ERROR',
  message: 'Cashu transaction Error.',
};

module.exports.PAYMENT_FAILURE = {
  code: 500,
  message: 'Payment failed',
};

