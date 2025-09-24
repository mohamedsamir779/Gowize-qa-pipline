const mongoose = require('mongoose');

const { Cruds, dbConnectionUpCb } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');

const RequestsModel = require('./request.model');
const { systemEmailService, customerService } = require('../services');

const getAggregation = (type, searchText = '', params = {}) => {
  let { finalMatch = {}, agent, customerId, ...rest } = params;
  let match = { ...rest };
  if (customerId) {
    match = { ...match, type, customerId: mongoose.Types.ObjectId(customerId) };
  }
  if (agent) {
    finalMatch = { ...finalMatch, agent };
  }
  if (!customerId && !agent) {
    match = { ...match, type };
  }
  switch (type) {
    case CONSTANTS.REQUESTS_TYPES.PARTNERSHIP:
    case CONSTANTS.REQUESTS_TYPES.LEVERAGE:
    case CONSTANTS.REQUESTS_TYPES.ACCOUNT:
      return [
        {
          $match: match
        }, {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
            pipeline: [
              {
                $project: {
                  agent: 1,
                  firstName: 1,
                  lastName: 1,
                  category: 1,
                  stages: 1,
                  email: 1,
                  fx: 1,
                },
              },
            ],
          },
        }, {
          $unwind: {
            path: '$customer',
            includeArrayIndex: 'a',
            preserveNullAndEmptyArrays: false,
          },
        }, {
          $addFields: {
            agent: '$customer.agent',
          },
        }, {
          $lookup: {
            from: 'users',
            localField: 'customer.agent',
            foreignField: '_id',
            as: 'customer.agent',
            pipeline: [
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  roleId: 1,
                },
              },
            ],
          },
        }, {
          $addFields: {
            customerId: {
              firstName: '$customer.firstName',
              lastName: '$customer.lastName',
              email: '$customer.email',
              stages: '$customer.stages',
              agent: { $arrayElemAt: ['$customer.agent', 0] },
              _id: '$customer._id',
            },
            stages: '$customer.stages',
          },
        }, {
          $match: {
            ...finalMatch,
          },
        },
      ];
    default:
      return [];
  }
};

const ibRequestFilter = (params) => {
  const { filteredValues = null } = params;
  let finalMatch = {};
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'status':
            params = { ...params, status: value };
            break;
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((item) => mongoose.Types.ObjectId(item)) },
            };
            break;
          case 'customerId':
            params = { ...params, customerId: value };
            break;
          case 'kyc':
            switch (value) {
              case 'kycNotUpload':
                finalMatch = {
                  ...finalMatch,
                  'stages.kycUpload': false,
                };
                break;
              case 'kycRejected':
                finalMatch = {
                  ...finalMatch,
                  'stages.kycRejected': true,
                };
                break;
              case 'kycApproved':
                finalMatch = {
                  ...finalMatch,
                  'stages.kycApproved': true,
                };
                break;
              case 'kycNotApproved':
                finalMatch = {
                  ...finalMatch,
                  'stages.kycApproved': false,
                };
                break;
              default:
                finalMatch = {
                  ...finalMatch,
                  'stages.kycUpload': false,
                };
                break;
            }
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) }
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            params = { ...params, key: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return { ...params, finalMatch };
}

const accountRequestFilter = (params) => {
  const { filteredValues = null } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) }
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((item) => mongoose.Types.ObjectId(item)) },
            };
            break;
          default:
            params = { ...params, [key]: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
}

const leverageRequestFilter = (params) => {
  const { filteredValues = null } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) }
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((item) => mongoose.Types.ObjectId(item)) },
            };
            break;
          default:
            params = { ...params, [key]: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
}
class RequestsService extends Cruds {
  createIbRequest(customerId, approved = false) {
    return this.create({
      customerId,
      type: CONSTANTS.REQUESTS_TYPES.PARTNERSHIP,
      status: approved ? CONSTANTS.REQUESTS_STATUS.APPROVED : CONSTANTS.REQUESTS_STATUS.PENDING,
    });
  }

  getIbRequest(customerId) {
    return this.findOne({
      customerId,
      type: CONSTANTS.REQUESTS_TYPES.PARTNERSHIP,
    });
  }

  createChangeLeverageRequest(customerId, body) {
    return this.create({
      customerId,
      type: CONSTANTS.REQUESTS_TYPES.LEVERAGE,
      content: {
        login: body.login,
        from: body.from,
        to: body.to,
        platform: body.platform,
      },
    });
  }

  async getAccountRequests(params) {
    params = await accountRequestFilter(params);
    const {
      searchText, page, limit, sort, ...rest
    } = params;
    const aggregation = getAggregation(
      CONSTANTS.REQUESTS_TYPES.ACCOUNT,
      searchText,
      rest,
    );
    return this.aggregateWithPagination(
      aggregation,
      {
        page,
        limit,
        sort,
      },
    );
  }

  createAccountRequest(customerId, accountTypeId, {
    platform,
    type,
    leverage = 400,
    currency = 'USD',
    reason,
  }) {
    return this.create({
      customerId,
      type: CONSTANTS.REQUESTS_TYPES.ACCOUNT,
      content: {
        accountTypeId,
        platform,
        currency,
        type,
        from: parseInt(leverage, 10),
        reason,
      },
    });
  }

  async getIbRequests(params) {
    params = await ibRequestFilter(params);
    delete params.filteredValues;
    const {
      searchText, page, limit, sort, ...rest
    } = params;
    const aggregation = getAggregation(
      CONSTANTS.REQUESTS_TYPES.PARTNERSHIP,
      searchText,
      rest,
    );
    return this.aggregateWithPagination(
      aggregation,
      {
        page,
        limit,
        sort,
      },
    );
  }

  async getLeverageRequests(params) {
    params = await leverageRequestFilter(params);
    const {
      searchText, page, limit, sort, ...rest
    } = params;
    const aggregation = getAggregation(
      CONSTANTS.REQUESTS_TYPES.LEVERAGE,
      searchText,
      rest,
    );
    return this.aggregateWithPagination(
      aggregation,
      {
        page,
        limit,
        sort,
      },
    );
  }
}

async function requestWatcher() {
  const collection = mongoose.connection.db.collection('requests');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      let action = '';
      const customer = await customerService.findById(fullDocument.customerId);
      const emailObject = {
        ...customer,
        ...fullDocument.content,
      };
      switch (fullDocument.type) {
        case CONSTANTS.REQUESTS_TYPES.LEVERAGE:
          action = CONSTANTS.EMAIL_ACTIONS.CHANGE_LEVERAGE_REQUEST;
          break;
        case CONSTANTS.REQUESTS_TYPES.PARTNERSHIP:
          action = CONSTANTS.EMAIL_ACTIONS.PARTNERSHIP_REQUEST;
          break;
        case CONSTANTS.REQUESTS_TYPES.ACCOUNT:
          action = fullDocument.content.type === CONSTANTS.TRADING_ACCOUNT_TYPES.DEMO
            ? CONSTANTS.EMAIL_ACTIONS.DEMO_ACCOUNT_REQUEST
            : CONSTANTS.EMAIL_ACTIONS.LIVE_ACCOUNT_REQUEST;
          break;
        default:
          return;
      }
      systemEmailService.sendSystemEmail(
        action, {
        to: customer.email,
        lang: customer?.language,
      }, emailObject,
      );
    } else if (operationType === 'update') {
      let action = '';
      const customer = await customerService.findById(fullDocument.customerId);
      if (updateDescription.updatedFields.status !== null) {
        const emailObject = {
          ...customer,
          ...fullDocument.content,
        };
        const isApproved = updateDescription.updatedFields.status === 'APPROVED';
        switch (fullDocument.type) {
          case CONSTANTS.REQUESTS_TYPES.LEVERAGE:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.CHANGE_LEVERAGE_APPROVAL
              : CONSTANTS.EMAIL_ACTIONS.CHANGE_LEVERAGE_REJECTION;
            break;
          case CONSTANTS.REQUESTS_TYPES.PARTNERSHIP:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.PARTNERSHIP_APPROVAL
              : CONSTANTS.EMAIL_ACTIONS.PARTNERSHIP_REJECTION;
            break;
          case CONSTANTS.REQUESTS_TYPES.ACCOUNT:
            // approval handled in account service
            if (isApproved) return;
            action = fullDocument.content.type === CONSTANTS.TRADING_ACCOUNT_TYPES.DEMO
              ? CONSTANTS.EMAIL_ACTIONS.DEMO_ACCOUNT_REJECTION
              : CONSTANTS.EMAIL_ACTIONS.LIVE_ACCOUNT_REJECTION;
            break;
          default:
            return;
        }
        if (action) {
          systemEmailService.sendSystemEmail(
            action, {
            to: customer.email,
            lang: customer?.language,
          }, emailObject,
          );
        }
      }
    }
  });
}
dbConnectionUpCb(requestWatcher);

module.exports = new RequestsService(RequestsModel.Model, RequestsModel.Schema);
