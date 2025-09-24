const { Sequelize, Op } = require('sequelize');
const moment = require('moment');
const { createPagination } = require('src/common/handlers');
const {
  Types,
} = require('mongoose');
const { Model, Schema } = require('../deals.model');
const {
  customerService,
  fxTransactionService,
  accountService,
  walletService,
} = require('../../../services');
const { REPORT_COL_KEY } = require('../../../../common/data/constants');

const aggregationByLogin = (dateFrom, dateTo, agent, type, creditQuery = {}) => {
  const query = {
    createdAt: {
      $gte: new Date(dateFrom),
      $lt: new Date(dateTo),
    },
    type,
    status: 'APPROVED',
    ...creditQuery,
  };
  const aggregation = [
    {
      $match: query,
    },
    {
      $group: {
        _id: '$tradingAccountId',
        amount: {
          $sum: '$amount',
        },
        createdAt: {
          $last: '$createdAt',
        },
      },
    },
    {
      $lookup: {
        from: 'tradingaccounts',
        localField: '_id',
        foreignField: '_id',
        as: 'account',
        pipeline: [
          {
            $project: {
              _id: 1,
              login: 1,
              type: 1,
              platform: 1,
              customerId: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$account',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        customerId: '$account.customerId',
        login: '$account.login',
        platform: '$account.platform',
        type: '$account.type',
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'customer',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
              agent: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        agentId: {
          $ifNull: ['$customer.agent', null],
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'agentId',
        foreignField: '_id',
        as: 'agent',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$agent',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  if (agent) {
    aggregation.push({
      $match: {
        agentId: Types.ObjectId(agent),
      },
    });
  }
  return aggregation;
};
// This works only for fx transactions
// const aggregationByClient = (dateFrom, dateTo, agent, type, creditQuery = {}) => {
//   const query = {
//     createdAt: {
//       $gte: new Date(dateFrom),
//       $lt: new Date(dateTo),
//     },
//     type,
//     status: 'APPROVED',
//     ...creditQuery,
//   };
//   const aggregation = [
//     {
//       $match: query,
//     },
//     {
//       $group: {
//         _id: '$customerId',
//         amount: {
//           $sum: '$amount',
//         },
//         createdAt: {
//           $last: '$createdAt',
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: 'customers',
//         localField: '_id',
//         foreignField: '_id',
//         as: 'customer',
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               firstName: 1,
//               lastName: 1,
//               email: 1,
//               agent: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: {
//         path: '$customer',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $addFields: {
//         agentId: {
//           $ifNull: ['$customer.agent', null],
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'agentId',
//         foreignField: '_id',
//         as: 'agent',
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               firstName: 1,
//               lastName: 1,
//               email: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: {
//         path: '$agent',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//   ];
//   if (agent) {
//     aggregation.push({
//       $match: {
//         agentId: Types.ObjectId(agent),
//       },
//     });
//   }
//   return aggregation;
// };

const aggregationByClient = (dateFrom, dateTo, agent, type) => {
  const query = {
    createdAt: {
      $gte: new Date(dateFrom),
      $lt: new Date(dateTo),
    },
    type,
    status: 'APPROVED',
  };
  const aggregation = [
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        agent: 1,
        parentId: 1,
      },
    },
    {
      $lookup: {
        from: 'transactionsfxes',
        localField: '_id',
        foreignField: 'customerId',
        as: 'fxTransactions',
        pipeline: [
          {
            $match: query,
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: 'customerId',
        as: 'walletTransactions',
        pipeline: [
          {
            $match: query,
          },
        ],
      },
    },
    {
      $addFields: {
        walletSum: {
          $sum: '$walletTransactions.amount',
        },
        fxSum: {
          $sum: '$fxTransactions.amount',
        },
        total: {
          $sum: [
            {
              $sum: '$walletTransactions.amount',
            },
            {
              $sum: '$fxTransactions.amount',
            },
          ],
        },
      },
    },
    {
      $match: {
        total: {
          $gt: 0,
        },
      },
    },
  ];
  if (agent && agent !== '') {
    aggregation.push({
      $match: {
        agent: Types.ObjectId(agent),
      },
    });
  }
  aggregation.push(
    {
      $lookup: {
        from: 'users',
        localField: 'agent',
        foreignField: '_id',
        as: 'agent',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        ],
      },
    }, {
      $unwind: {
        path: '$agent',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'parentId',
        foreignField: '_id',
        as: 'parent',
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$parent',
        preserveNullAndEmptyArrays: true,
      },
    },
  );
  return aggregation;
};

const aggregationGetTotal = async (dateFrom, dateTo, agent, type) => {
  const aggregation = aggregationByLogin(dateFrom, dateTo, agent, type);
  aggregation.push({
    $group: {
      _id: null,
      [type === 'DEPOSIT' ? 'totalDeposit' : 'totalWithdrawal']: {
        $sum: '$amount',
      },
    },
  });
  const resp = await fxTransactionService.aggregate(aggregation);
  return resp;
};

const totalDepositAmountMongo = async (dateFrom, dateTo, agent) => {
  const resp = await aggregationGetTotal(dateFrom, dateTo, agent, 'DEPOSIT');
  return resp;
};

const totalWithdrawalAmountMongo = async (dateFrom, dateTo, agent) => {
  const resp = await aggregationGetTotal(dateFrom, dateTo, agent, 'WITHDRAW');
  return resp;
};

const getDepositsFromMongo = async (page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const aggregation = aggregationByLogin(dateFrom, dateTo, agent, 'DEPOSIT');
  const records = await fxTransactionService.findWithAggregation(aggregation, {
    page,
    limit,
  });
  if (download) {
    const docs = records?.docs?.map((obj) => ({
      [REPORT_COL_KEY.CUSTOMER_FIRST_NAME]: obj?.customer?.firstName || '',
      [REPORT_COL_KEY.CUSTOMER_LAST_NAME]: obj?.customer?.lastName || '',
      [REPORT_COL_KEY.CUSTOMER_EMAIL]: obj?.customer?.email || '',
      [REPORT_COL_KEY.AMOUNT]: obj.amount,
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return records;
};

const getWithdrawalsFromMongo = async (page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const aggregation = aggregationByLogin(dateFrom, dateTo, agent, 'WITHDRAW');
  const records = await fxTransactionService.findWithAggregation(aggregation, {
    page,
    limit,
  });
  if (download) {
    const docs = records?.docs?.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.AMOUNT]: obj.amount,
      [REPORT_COL_KEY.COMMENT]: `DEPOSIT_${obj.customer.firstName}_${obj.customer.lastName}_${obj.customer.email}`,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return records;
};

const getDeposits = async (page, limit, dateFrom, dateTo, logins,
  download = false) => {
  limit = parseInt(limit);
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: 2,
    profit: {
      [Op.gt]: 0,
    },
    comment: {
      [Op.and]: [
        { [Op.notLike]: '%transfer_to%' },
        { [Op.notLike]: '%transfer_from%' },
        { [Op.like]: '%DEPOSIT_%' },
      ],
    },
  };
  if (logins) {
    query.login = {
      [Op.in]: logins,
    };
  }
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      'login',
      'time',
      'profit',
      'comment',
      'createdAt',
    ],
    limit,
    offset: ((page) - 1) * limit,
    // group: 'clientLogin',
  });
  let rows = records.rows.map((obj) => ({
    ...obj.dataValues,
  }));
  rows = await Promise.all(rows.map(async (obj) => {
    const account = await accountService.findOne({
      login: obj.login,
    });
    if (!account) return obj;
    const details = await customerService.find({
      _id: Types.ObjectId(account.customerId),
    }, {}, {
      populate: {
        path: 'agent',
        select: 'firstName lastName email',
      },
    });
    if (!details.length) return obj;
    // eslint-disable-next-line prefer-destructuring
    const customer = details?.[0];
    return {
      ...obj,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        _id: customer._id,
      } : null,
      agent: customer?.agent ? {
        firstName: customer.agent.firstName,
        lastName: customer.agent.lastName,
        email: customer.agent.email,
      } : null,
    };
  }));
  const pagination = createPagination(records.count, (page || 1), limit);
  if (download) {
    const docs = rows.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.AMOUNT]: obj.profit,
      [REPORT_COL_KEY.COMMENT]: obj.comment,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return {
    docs: rows,
    ...pagination,
  };
};

const getTransactionDetails = async (
  dateFrom,
  dateTo,
  customerDetails, action, profit, comment,
) => {
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action,
    profit,
    comment,
  };
  for (let i = 0; i < customerDetails.length; i++) {
    const customer = customerDetails[i];
    query.login = {
      [Op.in]: customer.accounts,
    };
    const data = await Model.findAll({
      where: query,
      attributes: [
        'login',
        [Sequelize.fn('sum', Sequelize.col('profit')), 'profit'],
      ],
      group: 'login',
    });
    customerDetails[i].deposits = data.map((obj) => ({
      login: obj.login,
      amount: obj.profit,
    }));
  }
  return customerDetails;
};

const getClientDepositsFromMongo = async (
  dateFrom, dateTo,
  page, limit, agent, download = false,
) => {
  const aggregation = aggregationByClient(dateFrom, dateTo, agent, 'DEPOSIT');
  const records = await customerService.aggregateWithPagination(aggregation, {
    page,
    limit,
  });
  if (download) {
    const docs = records?.docs?.map((obj) => ({
      [REPORT_COL_KEY.CUSTOMER_FIRST_NAME]: obj?.customer?.firstName || '',
      [REPORT_COL_KEY.CUSTOMER_LAST_NAME]: obj?.customer?.lastName || '',
      [REPORT_COL_KEY.CUSTOMER_EMAIL]: obj?.customer?.email || '',
      [REPORT_COL_KEY.AMOUNT]: obj.amount,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return records;
};

const getClientWithdrawalsFromMongo = async (
  dateFrom, dateTo,
  page, limit, agent, download = false,
) => {
  const aggregation = aggregationByClient(dateFrom, dateTo, agent, 'WITHDRAW');
  const records = await customerService.aggregateWithPagination(aggregation, {
    page,
    limit,
  });
  if (download) {
    const docs = records?.docs?.map((obj) => ({
      [REPORT_COL_KEY.CUSTOMER_FIRST_NAME]: obj?.customer?.firstName || '',
      [REPORT_COL_KEY.CUSTOMER_LAST_NAME]: obj?.customer?.lastName || '',
      [REPORT_COL_KEY.CUSTOMER_EMAIL]: obj?.customer?.email || '',
      [REPORT_COL_KEY.AMOUNT]: obj.amount,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return records;
};

const getTotalAmountFromMongo = async (
  dateFrom, dateTo, agent, type,
) => {
  const aggregation = aggregationByClient(dateFrom, dateTo, agent, type);
  aggregation.push({
    $group: {
      _id: null,
      [type === 'DEPOSIT' ? 'totalDeposit' : 'totalWithdrawal']: {
        $sum: '$total',
      },
    },
  });
  const records = await customerService.aggregate(aggregation);
  return records;
};

const getClientDeposits = async (
  dateFrom,
  dateTo,
  customerDetails,
) => getTransactionDetails(dateFrom, dateTo, customerDetails, 2, {
  [Op.gt]: 0,
}, {
  [Op.and]: [
    { [Op.notLike]: '%transfer_to%' },
    { [Op.notLike]: '%transfer_from%' },
    { [Op.like]: '%DEPOSIT_%' },
  ],
});

const getTotalAmount = async (
  dateFrom,
  dateTo,
  profit,
  comment,
) => {
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: 2,
    profit,
    comment,
  };
  const data = await Model.findAll({
    where: query,
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('profit')), 'profit'],
    ],
  });
  return data[0].dataValues.profit;
};

const totalDepositAmount = async (dateFrom, dateTo) => getTotalAmount(
  dateFrom,
  dateTo,
  {
    [Op.gt]: 0,
  },
  {
    [Op.and]: [
      { [Op.notLike]: '%transfer_to%' },
      { [Op.notLike]: '%transfer_from%' },
      { [Op.like]: '%DEPOSIT_%' },
    ],
  },
);

const totalWithdrawalAmount = async (dateFrom, dateTo) => getTotalAmount(
  dateFrom,
  dateTo,
  {
    [Op.lt]: 0,
  },
  {
    [Op.and]: [
      { [Op.notLike]: '%transfer_to%' },
      { [Op.notLike]: '%transfer_from%' },
      { [Op.like]: '%WITHDRAW_%' },
    ],
  },
);

const getClientWithdrawals = async (
  dateFrom,
  dateTo,
  customerDetails,
) => getTransactionDetails(dateFrom, dateTo, customerDetails, 2, {
  [Op.lt]: 0,
}, {
  [Op.and]: [
    { [Op.notLike]: '%transfer_to%' },
    { [Op.notLike]: '%transfer_from%' },
    { [Op.like]: '%WITHDRAW_%' },
  ],
});

const getWithdrawals = async (page, limit, dateFrom, dateTo, logins,
  download = false) => {
  limit = parseInt(limit);
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: 2,
    profit: {
      [Op.lt]: 0,
    },
    comment: {
      [Op.and]: [
        { [Op.notLike]: '%transfer_to%' },
        { [Op.notLike]: '%transfer_from%' },
        { [Op.like]: '%WITHDRAW_%' },
      ],
    },
  };
  if (logins) {
    query.login = {
      [Op.in]: logins,
    };
  }
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      'login',
      'time',
      'profit',
      'comment',
      'createdAt',
    ],
    limit,
    offset: ((page) - 1) * limit,
    // group: 'clientLogin',
  });
  let rows = records.rows.map((obj) => ({
    ...obj.dataValues,
  }));
  rows = await Promise.all(rows.map(async (obj) => {
    const account = await accountService.findOne({
      login: obj.login,
    });
    if (!account) return obj;
    const details = await customerService.find({
      _id: Types.ObjectId(account.customerId),
    }, {}, {
      populate: {
        path: 'agent',
        select: 'firstName lastName email',
      },
    });
    if (!details) return obj;
    // eslint-disable-next-line prefer-destructuring
    const customer = details?.[0];
    return {
      ...obj,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        _id: customer._id,
      } : null,
      agent: customer?.agent ? {
        firstName: customer.agent.firstName,
        lastName: customer.agent.lastName,
        email: customer.agent.email,
      } : null,
    };
  }));
  const pagination = createPagination(records.count, (page || 1), limit);
  if (download) {
    const docs = rows.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.AMOUNT]: obj.profit,
      [REPORT_COL_KEY.COMMENT]: obj.comment,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return {
    docs: rows,
    ...pagination,
  };
};

const getCommission = async (page, limit, dateFrom, dateTo, wallets,
  download = false) => {
  limit = parseInt(limit);
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: {
      [Op.in]: [10, 18],
    },
    profit: {
      [Op.gt]: 0,
    },
  };
  if (wallets) {
    query.walletId = {
      [Op.in]: wallets.map((wallet) => (wallet)?.toString()),
    };
  }
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      'walletId',
      'time',
      'profit',
      'comment',
      'createdAt',
      'action',
      'clientDealId',
      'clientEntry',
      'clientLogin',
      'clientVolume',
      'clientVolumeClosed',
    ],
    limit,
    offset: ((page) - 1) * limit,
    // group: 'clientLogin',
  });
  let rows = records.rows.map((obj) => ({
    ...obj.dataValues,
  }));
  rows = await Promise.all(rows.map(async (obj) => {
    const wallet = await walletService.findOne({
      _id: Types.ObjectId(obj.walletId),
    });
    if (!wallet) return obj;
    const details = await customerService.find({
      _id: Types.ObjectId(wallet.belongsTo),
    }, {}, {
      populate: {
        path: 'agent',
        select: 'firstName lastName email',
      },
    });
    if (!details) return obj;
    // eslint-disable-next-line prefer-destructuring
    const customer = details?.[0];
    return {
      ...obj,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        _id: customer._id,
      } : null,
      agent: customer?.agent ? {
        firstName: customer.agent.firstName,
        lastName: customer.agent.lastName,
        email: customer.agent.email,
      } : null,
    };
  }));
  const pagination = createPagination(records.count, (page || 1), limit);
  if (download) {
    const docs = rows.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.AMOUNT]: obj.profit,
      [REPORT_COL_KEY.ACTION]: obj.action === 10 ? 'Rebate' : 'Commission',
      [REPORT_COL_KEY.DEAL_ID]: obj.clientDealId,
      [REPORT_COL_KEY.CLIENT_LOGIN]: obj.clientLogin,
      [REPORT_COL_KEY.CUSTOMER_FIRST_NAME]: obj?.customer?.firstName ?? '-',
      [REPORT_COL_KEY.CUSTOMER_LAST_NAME]: obj?.customer?.lastName ?? '-',
      [REPORT_COL_KEY.VOLUME]: obj.action === 10 ? parseFloat(obj.clientVolumeClosed) / 1000
        : (parseFloat(obj.clientVolume) / 1000),
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return {
    docs: rows,
    ...pagination,
  };
};

const getSummary = async (page, limit, dateFrom, dateTo, logins,
  download = false) => {
  limit = parseInt(limit);
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: {
      [Op.in]: [0, 1],
    },
    entry: 1,
  };
  if (logins) {
    query.login = {
      [Op.in]: logins,
    };
  }
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      'login',
      'time',
      'profit',
      'comment',
      'createdAt',
      'dealId',
      'positionId',
      'price',
      'volumeClosed',
    ],
    limit,
    offset: ((page) - 1) * limit,
    // group: 'clientLogin',
  });
  const rows = records.rows.map((obj) => ({
    ...obj.dataValues,
  }));
  const pagination = createPagination(records.count, (page || 1), limit);
  let stats;
  if (page == 1) {
    pagination.stats = await Model.findOne({
      where: query,
      attributes: [
        [Sequelize.fn('sum', Sequelize.col('profit')), 'Total Profit'],
      ],
      limit,
      offset: ((page) - 1) * limit,
      group: '',
    });
  }
  if (download) {
    const docs = rows.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.DEAL_ID]: obj.dealId,
      [REPORT_COL_KEY.POS_ID]: obj.positionId,
      [REPORT_COL_KEY.PRICE]: obj.price,
      [REPORT_COL_KEY.VOLUME]: obj.volumeClosed,
      [REPORT_COL_KEY.AMOUNT]: obj.profit,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return {
    docs: rows,
    ...pagination,
  };
};

const getLeadConverted = async (page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const query = {
    page,
    limit,
    'fx.demoConvertTime': {
      $gte: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
  };
  if (agent) {
    query.agent = agent;
  }
  const data = await customerService.findWithPagination(query, {
    populate: [{
      path: 'agent',
      select: 'firstName lastName',
    }],
  });
  if (download) {
    const docs = data.docs.map((obj) => ({
      [REPORT_COL_KEY.NAME]: `${obj.firstName} ${obj.lastName}`,
      [REPORT_COL_KEY.AGENT]: obj.agent ? `${obj.agent.firstName} ${obj.agent.lastName}` : '-',
      [REPORT_COL_KEY.CONVERT_TIME]: moment(obj.fx.demoConvertTime).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return data;
};

const getLeadCallStatus = async (page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const query = {
    page,
    limit,
    isLead: true,
    createdAt: {
      $gte: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
  };
  if (agent) {
    query.agent = agent;
  }
  const data = await customerService.findWithPagination(query, {
    populate: [{
      path: 'agent',
      select: 'firstName lastName',
    }],
  });
  if (download) {
    const docs = data.docs.map((obj) => ({
      [REPORT_COL_KEY.NAME]: `${obj.firstName} ${obj.lastName}`,
      [REPORT_COL_KEY.AGENT]: obj.agent ? `${obj.agent.firstName} ${obj.agent.lastName}` : '-',
      [REPORT_COL_KEY.CALL_STATUS]: obj.callStatus ?? '-',
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return data;
};

const getLastLogin = async (page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const query = {
    page,
    limit,
    lastLogin: {
      $gte: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
  };
  if (agent) {
    query.agent = agent;
  }
  const data = await customerService.findWithPagination(query, {
    populate: [{
      path: 'agent',
      select: 'firstName lastName email',
    }],
  });
  if (download) {
    const docs = data.docs.map((obj) => ({
      [REPORT_COL_KEY.NAME]: `${obj.firstName} ${obj.lastName}`,
      [REPORT_COL_KEY.AGENT]: obj.agent ? `${obj.agent.firstName} ${obj.agent.lastName}` : '-',
      [REPORT_COL_KEY.LAST_LOGIN]: moment(obj.lastLogin).format('DD/MM/YYYY HH:mm:ss'),
    }));
    return docs;
  }
  return data;
};

const getCreditReportFromMongo = async (type, page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const aggregation = aggregationByLogin(dateFrom, dateTo, agent, 'CREDIT',
    {
      amount: type === 'credit-in' ? { $gt: 0 } : { $lt: 0 },
    });
  const records = await fxTransactionService.findWithAggregation(aggregation);
  if (download) {
    const docs = records?.docs?.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.AMOUNT]: obj.amount,
      [REPORT_COL_KEY.DATE]: moment(obj.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      [REPORT_COL_KEY.CUSTOMER_FIRST_NAME]: obj?.customer?.firstName ?? '-',
      [REPORT_COL_KEY.CUSTOMER_LAST_NAME]: obj?.customer?.lastName ?? '-',
    }));
    return docs;
  }
  return records;
};

const getTotalCreditAmountFromMongo = async (type, dateFrom, dateTo, agent) => {
  const aggregation = aggregationByLogin(dateFrom, dateTo, agent, 'CREDIT',
    {
      amount: type === 'credit-in' ? { $gt: 0 } : { $lt: 0 },
    });
  aggregation.push({
    $group: {
      _id: null,
      totalCreditAmount: { $sum: '$amount' },
    },
  });
  const records = await fxTransactionService.aggregate(aggregation);
  return records;
};

const getCreditReport = async (type, page, limit, dateFrom, dateTo, agent,
  download = false) => {
  const query = {
    createdAt: {
      $gte: new Date(dateFrom),
      $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
    type: 'CREDIT',
    amount: type === 'credit-in' ? { $gt: 0 } : { $lt: 0 },
  };
  if (agent) {
    query.agent = agent;
  }
  const data = await fxTransactionService.getCredits({
    ...query,
    page,
    limit,
  });
  if (download) {
    return data.docs;
  }
  return data;
};

const getTotalCreditAmount = async (type, dateFrom, dateTo, logins) => {
  const query = {
    createdAt: {
      [Op.gte]: new Date(dateFrom),
      [Op.lte]: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
    action: 3,
    profit: type === 'credit-in' ? { [Op.gt]: 0 } : { [Op.lt]: 0 },
  };
  if (logins) {
    query.login = { [Op.in]: logins };
  }
  const data = await Model.sum('profit',
    {
      where: query,
      group: ['login'],
    });
  return data;
};

const getIbSummary = async (page, limit, dateFrom, dateTo, logins, download = false) => {
  limit = parseInt(limit, 10);
  const query = {
    createdAt: {
      [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
      [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
    },
    action: {
      [Op.in]: [10, 18],
    },
    profit: {
      [Op.gt]: 0,
    },
  };
  if (logins) {
    query.login = {
      [Op.in]: logins,
    };
  }
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN action=10 THEN profit ELSE 0 END')), 'rebate'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN action=18 THEN profit ELSE 0 END')), 'commission'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN clientEntry=1 THEN clientVolumeClosed ELSE 0 END')), 'lotsClosed'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN clientEntry=0 THEN clientVolume ELSE 0 END')), 'lotsOpened'],
      'login',
    ],
    limit,
    offset: ((page) - 1) * limit,
    group: 'login',
  });
  let rows = records.rows.map((obj) => ({
    ...obj.dataValues,
  }));
  rows = await Promise.all(rows.map(async (obj) => {
    const account = await accountService.findOne({
      login: obj.login,
    });
    if (!account) return obj;
    const details = await customerService.find({
      _id: Types.ObjectId(account.customerId),
    }, {}, {
      populate: {
        path: 'agent',
        select: 'firstName lastName email',
      },
    });
    if (!details) return obj;
    // eslint-disable-next-line prefer-destructuring
    const customer = details?.[0];
    return {
      ...obj,
      customer: customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        _id: customer._id,
      } : null,
      agent: customer?.agent ? {
        firstName: customer.agent.firstName,
        lastName: customer.agent.lastName,
        email: customer.agent.email,
      } : null,
    };
  }));
  const pagination = createPagination(records.count, (page || 1), limit);
  if (download) {
    const docs = rows.map((obj) => ({
      [REPORT_COL_KEY.LOGIN]: obj.login,
      [REPORT_COL_KEY.NAME]: `${obj?.customer?.firstName ?? '-'} ${obj?.customer?.lastName ?? '-'}`,
      [REPORT_COL_KEY.AGENT]: `${obj?.agent?.firstName ?? '-'} ${obj?.agent?.lastName ?? '-'}`,
      [REPORT_COL_KEY.LOTS_OPENED]: obj.lotsOpened,
      [REPORT_COL_KEY.LOTS_CLOSED]: obj.lotsClosed,
      [REPORT_COL_KEY.REBATE]: obj.rebate,
      [REPORT_COL_KEY.COMMISSION]: obj.commission,
    }));
    return docs;
  }
  return {
    docs: rows,
    ...pagination,
  };
};

const getUnfundedAccounts = async (page, limit, dateFrom, dateTo, agent, download = false) => {
  const query = {
    createdAt: {
      $gte: new Date(dateFrom),
      $lte: new Date(new Date(dateTo).setHours(23, 59, 59, 99)),
    },
    page,
    limit,
  };
  if (agent) {
    query.agent = agent;
  }
  const data = await accountService.getUnfundedAccounts(query);
  if (download) {
    return data.docs;
  }
  return data;
};

const downloadReport = async (params = {}) => {
  try {
    const {
      type, dateFrom, dateTo, agent, logins,
    } = params;

    let head = [];
    let docs = [];
    switch (type) {
      case 'deposits':
        head = [
          { header: 'First name', key: REPORT_COL_KEY.CUSTOMER_FIRST_NAME },
          { header: 'Last name', key: REPORT_COL_KEY.CUSTOMER_LAST_NAME },
          { header: 'Email', key: REPORT_COL_KEY.CUSTOMER_EMAIL },
          { header: 'Login', key: REPORT_COL_KEY.LOGIN },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
          { header: 'Date', key: REPORT_COL_KEY.DATE },
        ];
        // docs = await getDeposits(
        //   1, 999, dateFrom, dateTo, logins, true,
        // );
        docs = await getDepositsFromMongo(
          1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'withdrawals':
        head = [
          { header: 'Login', key: REPORT_COL_KEY.LOGIN },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
          { header: 'Date', key: REPORT_COL_KEY.DATE },
        ];
        // docs = await getWithdrawals(
        //   1, 999, dateFrom, dateTo, logins, true,
        // );
        docs = await getWithdrawalsFromMongo(
          1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'commission':
        head = [
          { header: 'Login', key: REPORT_COL_KEY.LOGIN },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
          { header: 'Action', key: REPORT_COL_KEY.ACTION },
          { header: 'Client First Name', key: REPORT_COL_KEY.CUSTOMER_FIRST_NAME },
          { header: 'Client Last Name', key: REPORT_COL_KEY.CUSTOMER_LAST_NAME },
          { header: 'Client Deal', key: REPORT_COL_KEY.DEAL_ID },
          { header: 'Client Login', key: REPORT_COL_KEY.CLIENT_LOGIN },
          { header: 'Client Volume', key: REPORT_COL_KEY.VOLUME },
          { header: 'Date', key: REPORT_COL_KEY.DATE },
        ];
        docs = await getCommission(
          1, 999, dateFrom, dateTo, logins, true,
        );
        break;
      case 'summary':
        head = [
          { header: 'Login', key: REPORT_COL_KEY.LOGIN },
          { header: 'Deal ID', key: REPORT_COL_KEY.DEAL_ID },
          { header: 'Position ID', key: REPORT_COL_KEY.POS_ID },
          { header: 'Price', key: REPORT_COL_KEY.PRICE },
          { header: 'Volume', key: REPORT_COL_KEY.VOLUME },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
          { header: 'Date', key: REPORT_COL_KEY.DATE },
        ];
        docs = await getSummary(
          1, 999, dateFrom, dateTo, logins, true,
        );
        break;
      case 'lead-converted':
        head = [
          { header: 'Name', key: REPORT_COL_KEY.NAME },
          { header: 'Agent', key: REPORT_COL_KEY.AGENT },
          { header: 'Convert Time', key: REPORT_COL_KEY.CONVERT_TIME },
        ];
        docs = await getLeadConverted(
          1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'lead-call-status':
        head = [
          { header: 'Name', key: REPORT_COL_KEY.NAME },
          { header: 'Agent', key: REPORT_COL_KEY.AGENT },
          { header: 'Call Status', key: REPORT_COL_KEY.CALL_STATUS },
          { header: 'Date', key: REPORT_COL_KEY.DATE },
        ];
        docs = await getLeadCallStatus(
          1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'last-login':
        head = [
          { header: 'Name', key: REPORT_COL_KEY.NAME },
          { header: 'Agent', key: REPORT_COL_KEY.AGENT },
          { header: 'Last Login', key: REPORT_COL_KEY.LAST_LOGIN },
        ];
        docs = await getLastLogin(
          1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'ib-summary':
        head = [
          { header: 'IB Name', key: REPORT_COL_KEY.NAME },
          { header: 'Agent', key: REPORT_COL_KEY.AGENT },
          { header: 'Lots Opened', key: REPORT_COL_KEY.LOTS_OPENED },
          { header: 'Lots Closed', key: REPORT_COL_KEY.LOTS_CLOSED },
          { header: 'Commission', key: REPORT_COL_KEY.COMMISSION },
          { header: 'Rebate', key: REPORT_COL_KEY.REBATE },
        ];
        docs = await getIbSummary(
          1, 999, dateFrom, dateTo, logins, true,
        );
        break;
      case 'client-deposits':
      case 'client-withdrawals':
        head = [
          { header: 'First name', key: REPORT_COL_KEY.CUSTOMER_FIRST_NAME },
          { header: 'Last name', key: REPORT_COL_KEY.CUSTOMER_LAST_NAME },
          { header: 'Email', key: REPORT_COL_KEY.CUSTOMER_EMAIL },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
        ];
        // docs = await getClientDeposits(
        //   dateFrom, dateTo, params.customerDetails,
        // );
        // const func = type === 'client-deposits' ? getClientDeposits : getClientWithdrawals;
        // docs = await func(
        //   dateFrom, dateTo, params.customerDetails,
        // );
        docs = await (type === 'client-deposits' ? getClientDepositsFromMongo(
          dateFrom, dateTo, 1, 999, agent, true,
        ) : getClientWithdrawalsFromMongo(
          dateFrom, dateTo, 1, 999, agent, true,
        ));
        break;
      case 'credit-in':
      case 'credit-out':
        head = [
          { header: 'Login', key: 'login' },
          { header: 'Amount', key: REPORT_COL_KEY.AMOUNT },
          { header: 'Customer First Name', key: REPORT_COL_KEY.CUSTOMER_FIRST_NAME },
          { header: 'Customer Last Name', key: REPORT_COL_KEY.CUSTOMER_LAST_NAME },
        ];
        // docs = await getCreditReport(
        //   type, 1, 1000, dateFrom, dateTo, agent, true,
        // );
        docs = await getCreditReportFromMongo(
          type, 1, 999, dateFrom, dateTo, agent, true,
        );
        break;
      case 'unfunded-accounts':
        head = [
          { header: 'Login', key: 'login' },
          { header: 'Currency', key: REPORT_COL_KEY.CURRENCY },
          { header: 'Customer First Name', key: REPORT_COL_KEY.CUSTOMER_FIRST_NAME },
          { header: 'Customer Last Name', key: REPORT_COL_KEY.CUSTOMER_LAST_NAME },
        ];
        docs = await getUnfundedAccounts(
          1, 1000, dateFrom, dateTo, agent, true,
        );
        docs = docs.map((item) => ({
          login: item.login,
          currency: item.currency,
          firstName: item.customer.firstName,
          lastName: item.customer.lastName,
        }));
        break;
      default:
        break;
    }
    return {
      head,
      docs,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getStats = async (type, dateFrom, dateTo, agent) => {
  try {
    switch (type) {
      case 'deposits':
        return await totalDepositAmountMongo(
          dateFrom, dateTo, agent,
        );
      case 'client-withdrawals':
      case 'client-deposits':
        return await getTotalAmountFromMongo(
          dateFrom, dateTo, agent, type === 'client-deposits' ? 'DEPOSIT' : 'WITHDRAW',
        );
      case 'withdrawals':
        return await totalWithdrawalAmountMongo(
          dateFrom, dateTo, agent,
        );
      case 'credit-in':
      case 'credit-out':
        return await getTotalCreditAmountFromMongo(
          type, dateFrom, dateTo, agent,
        );
      default:
        return {
          total: 0,
        };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  getStats,
  getDeposits,
  totalDepositAmountMongo,
  totalWithdrawalAmountMongo,
  getDepositsFromMongo,
  getWithdrawalsFromMongo,
  getClientDepositsFromMongo,
  getClientWithdrawalsFromMongo,
  getTotalAmountFromMongo,
  getCreditReportFromMongo,
  getTotalCreditAmountFromMongo,
  getWithdrawals,
  getCommission,
  getSummary,
  getLeadConverted,
  getLeadCallStatus,
  getLastLogin,
  downloadReport,
  getClientDeposits,
  getClientWithdrawals,
  totalDepositAmount,
  totalWithdrawalAmount,
  getCreditReport,
  getTotalCreditAmount,
  getUnfundedAccounts,
  getIbSummary,
};
