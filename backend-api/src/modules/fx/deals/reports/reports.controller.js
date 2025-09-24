//
/* eslint-disable class-methods-use-this */
const Excel = require('exceljs');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const service = require('./reports.service');
const {
  customerService,
  walletService,
} = require('../../../services');

const getLoginsforAgent = async (agent) => {
  if (!agent) return null;
  const customers = await customerService.find({
    agent,
  }, 'agent fx');
  let accounts = [];
  customers.forEach((obj) => {
    accounts = accounts.concat(obj.fx.ibMT4Acc);
    accounts = accounts.concat(obj.fx.ibMT5Acc);
    accounts = accounts.concat(obj.fx.ibCTRADERAcc);
    accounts = accounts.concat(obj.fx.liveAcc);
  });
  return accounts;
};
const getWalletIdsForAgent = async (agent) => {
  if (!agent) return null;
  const customers = await customerService.find({
    agent,
  }, 'agent _id');
  const ids = customers.map((obj) => obj._id);
  const wallets = await walletService.find({
    belongsTo: {
      $in: ids,
    },
  }, '_id');
  return wallets.map((obj) => obj._id);
};

const getCustomerAndLogins = async (page, limit, agent) => {
  const query = {
    $or: [
      { 'fx.ibMT4Acc': { $exists: true, $ne: [] } },
      { 'fx.ibMT5Acc': { $exists: true, $ne: [] } },
      { 'fx.ibCTRADERAcc': { $exists: true, $ne: [] } },
      { 'fx.liveAcc': { $exists: true, $ne: [] } },
    ],
    page,
    limit,
  };
  if (agent) query.agent = agent;
  const data = await customerService.findWithPagination(query, {
    populate: [
      {
        path: 'agent',
        select: 'firstName lastName email',
      },
    ],
  }, {
    agent: 1,
    fx: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    _id: 1,
  });
  data.docs.forEach((obj) => {
    const accounts = [];
    if (obj.fx.ibMT4Acc) accounts.push(...obj.fx.ibMT4Acc);
    if (obj.fx.ibMT5Acc) accounts.push(...obj.fx.ibMT5Acc);
    if (obj.fx.ibCTRADERAcc) accounts.push(...obj.fx.ibCTRADERAcc);
    if (obj.fx.liveAcc) accounts.push(...obj.fx.liveAcc);
    obj.accounts = accounts;
    delete obj.fx;
  });
  return data;
};

class TransactionController {
  async getStats(req, res, next) {
    try {
      const { type } = req.params;
      const { dateFrom, dateTo, agent } = req.query;
      const stats = await service.getStats(type, dateFrom, dateTo, agent);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, stats);
    } catch (error) {
      return next(error);
    }
  }

  async getDeposits(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      // const logins = await getLoginsforAgent(agent);
      // const records = await service.getDeposits(page, limit, dateFrom, dateTo, logins);
      const records = await service.getDepositsFromMongo(page, limit, dateFrom, dateTo, agent);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getClientDeposits(req, res, next) {
    const {
      dateFrom, dateTo, page = 1, agent = '', limit = 10,
    } = req.query;
    try {
      // const customerDetails = await getCustomerAndLogins(page, limit, agent);
      // const records = await service.getClientDeposits(dateFrom, dateTo, customerDetails.docs);
      // const totalDeposit = await service.totalDepositAmount(dateFrom, dateTo);
      const records = await service.getClientDepositsFromMongo(
        dateFrom,
        dateTo,
        page,
        limit,
        agent,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getClientWithdrawals(req, res, next) {
    const {
      dateFrom, dateTo, page = 1, agent = '', limit = 10,
    } = req.query;
    try {
      // const customerDetails = await getCustomerAndLogins(page, limit, agent);
      // const records = await service.getClientWithdrawals(dateFrom, dateTo, customerDetails.docs);
      // const totalWithdrawal = await service.totalWithdrawalAmount(dateFrom, dateTo);
      const records = await service.getClientWithdrawalsFromMongo(
        dateFrom,
        dateTo,
        page,
        limit,
        agent,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getWithdrawals(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      // const logins = await getLoginsforAgent(agent);
      // const records = await service.getWithdrawals(page, limit, dateFrom, dateTo, logins);
      const records = await service.getWithdrawalsFromMongo(page, limit, dateFrom, dateTo, agent);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getCommission(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      // const logins = await getLoginsforAgent(agent);
      const walletIds = await getWalletIdsForAgent(agent);
      const records = await service.getCommission(page, limit, dateFrom, dateTo, walletIds);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const logins = await getLoginsforAgent(agent);
      const records = await service.getSummary(page, limit, dateFrom, dateTo, logins);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getLeadConverted(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const records = await service.getLeadConverted(page, limit, dateFrom, dateTo, agent);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getLeadCallStatus(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const records = await service.getLeadCallStatus(page, limit, dateFrom, dateTo, agent);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getLastLogin(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const records = await service.getLastLogin(page, limit, dateFrom, dateTo, agent);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getCreditInReport(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      // const records =
        // await service.getCreditReport('credit-in', page, limit, dateFrom, dateTo, agent);
      // const logins = await getLoginsforAgent(agent);
      // const totalCreditIn =
        // await service.getTotalCreditAmount('credit-in', dateFrom, dateTo, logins);
      const records = await service.getCreditReportFromMongo(
        'credit-in',
        page,
        limit,
        dateFrom, dateTo, agent,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getCreditOutReport(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      // const records =
        // await service.getCreditReport('credit-out', page, limit, dateFrom, dateTo, agent);
      // const logins = await getLoginsforAgent(agent);
      // const totalCreditOut =
        // await service.getTotalCreditAmount('credit-out', dateFrom, dateTo, logins);
      const records = await service.getCreditReportFromMongo(
        'credit-out',
        page,
        limit,
        dateFrom, dateTo, agent,
      );
      const totalCreditOut = await service.getTotalCreditAmountFromMongo(
        'credit-out',
        dateFrom,
        dateTo,
        agent,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {
        ...records,
        totalAmount: totalCreditOut || 0,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getUnfundedAccounts(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const records = await service.getUnfundedAccounts(page, limit, dateFrom, dateTo, agent);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async getIbSummary(req, res, next) {
    try {
      const {
        dateFrom, dateTo, page = 1, agent = '', limit = 10,
      } = req.query;
      const logins = await getLoginsforAgent(agent);
      const records = await service.getIbSummary(page, limit, dateFrom, dateTo, logins);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, records);
    } catch (error) {
      return next(error);
    }
  }

  async downloadReport(req, res, next) {
    try {
      const { type } = req.params;
      const params = req.query;
      if (type === 'client-deposits' || type === 'client-withdrawals') {
        const customerDetails = await getCustomerAndLogins(1, 100000, params.agent);
        params.customerDetails = customerDetails.docs;
      }
      const data = await service.downloadReport({ type, ...params });
      if (data) {
        const { head, docs } = data;
        const workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res });
        const worksheet = workbook.addWorksheet('Report');
        worksheet.columns = head;
        docs.map((doc) => worksheet.addRow(doc).commit());
        worksheet.commit();
        workbook.commit();
        return res.writeHead(201, {
          'Content-Disposition': `attachment; filename="${type}.xlsx"`,
          'Transfer-Encoding': 'chunked',
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      }
      return next(data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TransactionController();
