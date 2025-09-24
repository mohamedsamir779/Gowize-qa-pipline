const customerService = require('../customers/customer.service');
const campaignUnsubscribersService = require('./unsubscribers/crm/campaign-unsubscribers.service');

const targetedGroupsFilter = (groups) => {
  const filterMappings = {
    clients: [
      { $or: [{ isLead: false }, { isLead: { $exists: false } }] },
    ],
    leads: [{ isLead: true }],
    kyc: {
      accepted: [{ 'stages.kycApproved': true }],
      rejected: [{ 'stages.kycRejected': true }],
      no_kyc: [{ 'stages.kycUpload': false }],
      pending: [
        {
          $and: [
            { isLead: false },
            { 'stages.kycApproved': false },
            { 'stages.kycRejected': false },
            { 'stages.kycUpload': true },
          ],
        },
      ],
    },
    nationality: (list) => [{ nationality: { $in: list } }],
    residence_country: (list) => [{ country: { $in: list } }],
    source: (list) => [{ source: { $in: list } }],
    call_status: (list) => [{ callStatus: { $in: list } }],
  };
  return groups.reduce((acc, group) => {
    const mapping = filterMappings[group.name];
    if (mapping) {
      const filter = typeof mapping === 'function' ? mapping(group.list) : mapping;
      if (group.name === 'kyc') {
        group.list.forEach((kyc) => {
          if (mapping[kyc]) {
            acc.push(...mapping[kyc]);
          }
        });
      } else {
        acc.push(...filter);
      }
    }
    return acc;
  }, []);
};

module.exports = {
  async getSubscribedClientsData(groups) {
    const targetedGroups = targetedGroupsFilter(groups);
    const pipeline = [
      {
        $match: {
          $or: targetedGroups,
        },
      },
      {
        $project: {
          email: 1,
          firstName: 1,
          lastName: 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          names: {
            $push: { $concat: ['$firstName', ' ', '$lastName'] },
          },
          email: { $first: '$email' },
        },
      },
      {
        $project: {
          email: '$email',
          names: {
            $map: {
              input: '$names',
              as: 'name',
              in: {
                firstName: { $arrayElemAt: [{ $split: ['$$name', ' '] }, 0] },
                lastName: { $arrayElemAt: [{ $split: ['$$name', ' '] }, 1] },
              },
            },
          },
        },
      },
    ];

    const clients = await customerService.aggregate(pipeline);
    const unsubscribers = await campaignUnsubscribersService.find();
    return clients.filter((doc) => (
      !unsubscribers.find((unsub) => doc._id.toString() === unsub.customerId.toString())
    ));
  },

  personalizeEmail(client) {
    const { email, names } = client;
    const { firstName, lastName } = names[0];
    return {
      to: email,
      substitutions: {
        firstName,
        lastName,
        email,
      },
    };
  },
};
