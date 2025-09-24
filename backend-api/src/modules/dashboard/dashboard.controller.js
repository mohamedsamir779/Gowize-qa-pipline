//
const {
  customerService, requestsService, fxTransactionService, transactionService, walletTransferService,
} = require('src/modules/services');
const { ApiResponse, addAgentToQuery } = require('src/common/handlers');
const { ResponseMessages, keys } = require('src/common/data');
const moment = require('moment');
const {
  Types,
} = require('mongoose');

class DictionaryController {
  async getCustomerCountriesStats(req, res, next) {
    try {
      const agg = [
        {
          $group: {
            _id: {
              // category: '$category',
              isLead: '$isLead',
              country: '$country',
            },
            total: {
              $sum: 1,
            },
          },
        },
      ];
      const data = await customerService.aggregate(agg);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (error) {
      return next(error);
    }
  }

  async getLeadStats(req, res, next) {
    try {
      let query = {
      };
      query = addAgentToQuery(req.user, query);
      const data = await customerService.getLeadsByCallStatus(query, req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (error) {
      return next(error);
    }
  }

  async getCustomerStats(req, res, next) {
    try {
      let query = {};
      if (req.user.roleId.key !== 'admin' || !req.user.roleId.isAdmin) {
        query = addAgentToQuery(req.user, query);
      }
      const agg = [
        {
          $match: query,
        },
        {
          $addFields: {
            assigned: {
              $gte: ['$agent', null], // check if agent exists
            },
            isLead: {
              $eq: ['$isLead', true],
            },
            new: {
              $gte: ['$createdAt', moment().subtract(parseInt(keys.newDays, 10), 'days').toDate()],
            },
          },
        },
        {
          $group: {
            _id: {
              isLead: '$isLead',
              assigned: '$assigned',
              new: '$new',
            },
            total: {
              $sum: 1,
            },
          },
        },
      ];
      const data = await customerService.aggregate(agg);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (error) {
      return next(error);
    }
  }

  async getRequestStats(req, res, next) {
    try {
      const agg = [
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
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
              $ifNull: ['$agentId', '$customer.agent'],
            },
          },
        },
        {
          $match: req.user.roleId.isAdmin ? {} : {
            agentId: {
              $in: [Types.ObjectId(req.user._id)],
            },
          },
        },
        {
          $group: {
            _id: {
              type: '$type',
              status: '$status',
            },
            total: {
              $sum: 1,
            },
          },
        },
      ];
      const data = await requestsService.aggregate(agg);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (error) {
      return next(error);
    }
  }

  async getTransactionStats(req, res, next) {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
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
              $ifNull: ['$agentId', '$customer.agent'],
            },
          },
        },
        {
          $match: req.user.roleId.isAdmin ? {} : {
            agentId: {
              $in: [Types.ObjectId(req.user._id)],
            },
          },
        },
        {
          $group: {
            _id: {
              type: '$type',
              status: '$status',
            },
            total: {
              $sum: 1,
            },
          },
        },
      ];
      const data = await fxTransactionService.aggregate(pipeline);
      const walletsData = await transactionService.aggregate(pipeline);
      const walletTransferData = await walletTransferService.aggregate(pipeline);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {
        forex: data,
        wallets: [
          ...walletsData,
          ...walletTransferData.map((item) => {
            item._id.type = 'INTERNAL_TRANSFER';
            return item;
          }),
        ],
      });
    } catch (error) {
      return next(error);
    }
  }

  async getKycStats(req, res, next) {
    try {
      let query = { isLead: false };
      query = addAgentToQuery(req.user, query);
      const agg = [
        {
          $match: query,
        },
        {
          $addFields: {
            approved: {
              $eq: ['$stages.kycApproved', true],
            },
            rejected: {
              $eq: ['$stages.kycRejected', true],
            },
            pending: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$stages.kycApproved', false] },
                    { $eq: ['$stages.kycRejected', false] },
                    { $eq: ['$stages.kycUpload', true] },
                  ],
                }, true, false,
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              approved: '$approved',
              rejected: '$rejected',
              pending: '$pending',
            },
            total: {
              $sum: 1,
            },
          },
        },
      ];
      const data = await customerService.aggregate(agg);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = new DictionaryController();
