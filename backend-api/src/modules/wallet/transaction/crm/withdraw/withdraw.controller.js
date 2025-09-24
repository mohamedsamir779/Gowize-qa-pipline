//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, addAgentToQuery } = require('src/common/handlers');
const { enableCrypto } = require('src/common/data/keys');

const { transactionService: service, dTransactionService: dservice } = allServices;

class WithdrawController {
  async basicWithdraw(req, res, next) {
    try {
      const rec = enableCrypto && (req.customer && req.customer.isLead)
        ? await dservice.basicWithdraw({
          ...req.body,
          isAutoApprove: true,
          userId: req.user && req.user._id,
        }) : await service.basicWithdraw({
          ...req.body,
          isAutoApprove: true,
          userId: req.user && req.user._id,
        });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async cryptoWithdraw(req, res, next) {
    try {
      const rec = await service.addPendingBlockchainWithdraw(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const { filteredValues = null } = query;
      delete query.filteredValues;
      if (filteredValues) {
        for (const [key, value] of Object.entries(filteredValues)) {
          if (value && value != '') {
            switch (key) {
              case 'filterDate':
                if (value.fromDate && value.toDate) {
                  query = {
                    ...query,
                    createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate),
                    },
                  } 
                }
                else {
                  if (value.fromDate) {
                    query = { ...query, createdAt: { $gte: new Date(value.fromDate) } };

                  }
                  if (value.toDate) {
                    query = { ...query, createdAt: { $lte: new Date(value.toDate) } };

                  }
                }
                break;
              default:
                query = { ...query, [key]: value };
            }
          }
        }
      }
      const rec = req.query.type === CONSTANTS.CUSTOMER_TYPES.DEMO
        ? await dservice.getWithdraws(query)
        : await service.getWithdraws(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  // getting transactions/withdrawal done by a client where clientId = customerId
  async getRecordsForClientId(req, res, next) {
    const clientId = req.params.id;
    try {
      const rec = await service.getWithdraws({
        customerId: clientId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getGateways(req, res, next) {
    try {
      const rec = await service.getWithdrawalGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveWithdraw(req, res, next) {
    try {
      const { id } = req.params;
      const query = {
        id,
        userId: req.user && req.user._id,
      };
      const rec = (req.customer && req.customer.isLead)
        ? await dservice.approveWithdraw(query) : await service.approveWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async rejectWithdraw(req, res, next) {
    try {
      const { id } = req.params;
      const query = {
        id,
        userId: req.user && req.user._id,
      };
      const rec = (req.customer && req.customer.isLead)
        ? await dservice.rejectWithdraw(query) : await service.rejectWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WithdrawController();
