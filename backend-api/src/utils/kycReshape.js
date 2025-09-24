module.exports.kycReshape = (data) => {
  switch (data) {
    case 'KYC_PENDING':
      return {
        'stages.kycUpload': false,
      };
    case 'KYC_UPLOADED':
      return {
        $and: [
          { 'stages.kycUpload': true },
          { 'stages.kycApproved': false },
          { 'stages.kycRejected': false },
        ],
      };
    case 'KYC_APPROVED':
      return {
        'stages.kycApproved': true,
      };
    case 'KYC_REJECTED':
      return {
        'stages.kycRejected': true,
      };
    default: return {};
  }
};
