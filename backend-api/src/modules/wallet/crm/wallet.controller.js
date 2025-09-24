//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { enableCrypto } = require('../../../common/data/keys');

const {
  dWalletService: dservice,
  walletService: service,
  transactionService,
} = allServices;

class WalletController {
  async generateWalletForAsset(req, res, next) {
    try {
      const params = req.body;
      if (!params.belongsTo) params.belongsTo = req.user._id;
      params.createdBy = req.user && req.user._id;
      const response = await service.generateWallet(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      delete req.query.customerId;
      const rec = req.customer && !req.customer.isLead
        ? await service.findWithPagination({
          ...req.query,
        }, {
          populate: [{
            path: 'belongsTo',
            select: 'firstName lastName email',
          }, {
            path: 'assetId',
            select: 'symbol active description disabled isCrypto image networks',
          }, {
            path: 'networks',
          }],
        }) : await dservice.findWithPagination({
          ...req.query,
        }, {
          populate: [{
            path: 'belongsTo',
            select: 'firstName lastName email',
          }, {
            path: 'assetId',
            select: 'symbol active description disabled isCrypto image',
          }],
        });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async tatumWalletPendingTransaction(req, res, next) {
    try {
      const data = req.body;
      const { id: tatumVirtualId } = req.params;
      const wallet = await service.findOne({
        tatumVirtualId,
      });
      transactionService.addPendingBlockchainDeposit({
        tatumVirtualId,
        customerId: wallet.belongsTo,
        walletId: wallet._id,
        rawData: data,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {});
    } catch (error) {
      return next(error);
    }
  }

  async tatumWalletIncomingTransaction(req, res, next) {
    try {
      const data = req.body;
      const { id: tatumVirtualId } = req.params;
      const wallet = await service.findOne({
        tatumVirtualId,
      });
      transactionService.addUpdateBlockchainDeposit({
        tatumVirtualId,
        customerId: wallet.belongsTo,
        walletId: wallet._id,
        rawData: data,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {});
    } catch (error) {
      return next(error);
    }
  }

  async updateWallet(req, res, next) {
    try {
      const { status: active } = req.body;
      const { id } = req.params;
      const rec = await service.updateById(id, {
        active,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WalletController();
