// trading service for handling trading accounts
const { Cruds, SendEvent } = require('src/common/handlers');
const mongoose = require('mongoose');
const IbAgrementModel = require('./ibagrement.model');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../common/data/constants');

let customerService;
let walletService;

class IBAgrementService extends Cruds {
  async createMasterAgrement(customer, title, values, useWallet = true) {
  // const csust
    if (!customer || !customer.fx) {
      throw new Error('Not Fx client');
    }
    if (!useWallet) {
      if (
        (!customer.fx.ibMT4Acc || customer.fx.ibMT4Acc.length === 0)
      && (!customer.fx.ibMT5Acc || customer.fx.ibMT5Acc.length === 0)
      && (!customer.fx.ibCTRADERAcc || customer.fx.ibCTRADERAcc.length === 0)
      ) {
        throw new Error('No IB accounts found');
      }
      return this.create({
        title,
        isMaster: true,
        members: [{
          customerId: customer._id,
          values,
          ibMT5: (customer.fx.ibMT5Acc && customer.fx.ibMT5Acc[0]) || null,
          ibMT4: (customer.fx.ibMT4Acc && customer.fx.ibMT4Acc[0]) || null,
        }],
      });
    }
    const ibWallet = await walletService.getWalletByCustomerId(customer._id);
    if (!ibWallet) {
      throw new Error('No wallet found');
    }
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CREATE_MASTER_AGREEMENT,
      {
        customerId: customer._id,
        // userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          title,
          values,
        },
      },
    );
    return this.create({
      title,
      isMaster: true,
      members: [{
        customerId: customer._id,
        values,
        // ibMT5: (customer.fx.ibMT5Acc && customer.fx.ibMT5Acc[0]) || null,
        // ibMT4: (customer.fx.ibMT4Acc && customer.fx.ibMT4Acc[0]) || null,
        // ibCTRADER: (customer.fx.ibCTRADERAcc && customer.fx.ibCTRADERAcc[0]) || null,
        walletId: ibWallet._id,
      }],
    });
  }

  async updateMasterAgrement(id, title, values, customerId, userId) {
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UPDATE_MASTER_AGREEMENT,
      {
        customerId,
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          title,
          values,
        },
      },
    );
    return this.updateById(id, {
      title,
      members: [{
        customerId,
        values,
      }],
    });
  }

  async createSharedAgrement(customers, title, totals, members, useWallet = true) {
    // const csust
    if (customers.length !== members.length) {
      throw new Error('Invalid customers added');
    }
    if (useWallet) {
      for (let ind = 0; ind < customers.length; ind++) {
        const customer = customers[ind];
        const ibWallet = await walletService.getWalletByCustomerId(customer._id);
        if (!ibWallet) {
          throw new Error('No wallet found');
        }
      }
      const memArr = [];
      members.forEach((member) => {
        const ib = customers.find((obj) => obj._id.toString() === member.customerId.toString());
        if (!ib) {
          throw new Error('IB not found');
        }
        const ibWallet = walletService.getWalletByCustomerId(ib._id);
        memArr.push({
          customerId: ib._id,
          walletId: ibWallet._id,
          level: member.level,
          values: member.values,
        });
      });
      return this.create({
        title,
        isMaster: false,
        totals,
        members: memArr,
      });
    }
    for (let ind = 0; ind < customers.length; ind++) {
      const customer = customers[ind];
      if (
        (!customer.fx.ibMT4Acc || customer.fx.ibMT4Acc.length === 0)
        && (!customer.fx.ibMT5Acc || customer.fx.ibMT5Acc.length === 0)
        && (!customer.fx.ibCTRADERAcc || customer.fx.ibCTRADERAcc.length === 0)
      ) {
        throw new Error('No IB accounts found');
      }
    }
    const memArr = [];
    members.forEach((member) => {
      const ib = customers.find((obj) => obj._id.toString() === member.customerId.toString());
      if (!ib) {
        throw new Error('IB not found');
      }
      memArr.push({
        customerId: ib._id,
        ibMT5: ib.fx.ibMT5Acc[0],
        ibMT4: ib.fx.ibMT4Acc[0],
        ibCTRADER: ib.fx.ibCTRADERAcc[0],
        level: member.level,
        values: member.values,
      });
    });
    members.forEach((member) => {
      const ib = customers.find((obj) => obj._id.toString() === member.customerId.toString());
      if (!ib) {
        throw new Error('IB not found');
      }
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CREATE_SHARED_AGREEMENT,
        {
          customerId: ib._id,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            title,
            totals,
            members,
          },
        },
      );
    });
    return this.create({
      title,
      isMaster: false,
      totals,
      members: memArr,
    });
  }

  async updateSharedAgrement(id, title, totals, members, userId) {
    members.forEach((member) => {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_SHARED_AGREEMENT,
        {
          customerId: member.customerId,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            title,
            totals,
            members,
          },
        },
      );
    });
    return this.updateById(id, {
      title,
      totals,
      members,
    });
  }

  async deleteAgreement(id, userId) {
    const agreement = await this.findById(id);
    if (!agreement) {
      throw new Error('Agreement not found');
    }
    const customers = await customerService.find({
      'fx.agrementId': mongoose.Types.ObjectId(id),
    });
    if (customers.length > 0) {
      throw new Error('Agreement has customers');
    }
    agreement.members.forEach((member) => {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.DELETE_AGREEMENT,
        {
          customerId: member.customerId,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            agreementId: id,
            title: agreement.title,
          },
        },
      );
    });
    return this.deleteById(id);
  }

  async getInvolvedAgreements(customerId) {
    const filters = {
      members: { $elemMatch: { customerId: mongoose.Types.ObjectId(customerId) } },
      isHidden: {
        $in: [null, false],
      },
    };
    return this.find(
      filters,
      {},
      {
        populate: {
          path: 'members',
          populate: {
            path: 'customerId',
            select: 'firstName lastName fx',
          },
        },
      },
    );
  }
}

module.exports = new IBAgrementService(IbAgrementModel.Model, IbAgrementModel.Schema);

setTimeout(() => {
  const service = require('src/modules/services');
  customerService = service.customerService;
  walletService = service.walletService;
}, 0);
