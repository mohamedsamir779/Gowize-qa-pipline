module.exports.KNET_AUTH_CHECKOUT_ERROR = {
  code: 502,
  message: 'Failed to authenticate checkout',
};

module.exports.KNET_AUTH_CHECKOUT_SUCCESS = {
  code: 201,
  message: 'Knet Checkout Authenticated Successfully.',
};

module.exports.VIEW_CONTENT_KNET_SUCCESS = {
  heading: 'Thank you!',
  message: 'KNET payment Successfull !',
  description: 'Your payment is successfull, please allow 1-2 business days to process.',
  tagline: '',
};

module.exports.VIEW_CONTENT_KNET_CANCELLED = {
  heading: 'Thank you!',
  message: 'KNET payment Cancelled !',
  description: 'Your payment is cancelled.',
  tagline: '',
};

module.exports.VIEW_CONTENT_KNET_FAILED = {
  heading: 'Uh ho!',
  message: 'KNET Payment Failed.',
  description: 'Your payment is failed, try again or use any other payment option.',
  tagline: '',
};

module.exports.VIEW_CONTENT_QR_FAILED = {
  heading: 'Uh ho!',
  message: 'QR Payment Failed.',
  description: 'Your payment is failed, try again or use any other payment option.',
  tagline: '',
};
