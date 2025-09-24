const pipleline = [
  {
    $facet:
    {
      clients: [
        {
          $match: { $or: [{ isLead: false }, { isLead: { $exists: false } }] },
        },
        {
          $count: 'count',
        },
      ],
      leads: [
        {
          $match: { isLead: true },
        },
        {
          $count: 'count',
        },
      ],
      kyc: [
        {
          $match: { isLead: false },
        },
        {
          $addFields: {
            kycStatus: {
              $switch: {
                branches: [
                  { case: { $eq: ['$stages.kycApproved', true] }, then: 'accepted' },
                  { case: { $eq: ['$stages.kycRejected', true] }, then: 'rejected' },
                  { case: { $eq: ['$stages.kycUpload', false] }, then: 'no_kyc' },
                ],
                default: 'pending',
              },
            },
          },
        },
        {
          $group: {
            _id: '$kycStatus',
            count: {
              $sum: 1,
            },
          },
        },
      ],
      nationality: [
        {
          $group: {
            _id: '$nationality',
            count: { $sum: 1 },
          },
        },
      ],
      residence_country: [
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 },
          },
        },
      ],
      source: [
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
          },
        },
      ],
      call_status: [
        {
          $group: {
            _id: '$callStatus',
            count: { $sum: 1 },
          },
        },
      ],
    },
  },
];

module.exports = pipleline;
