const moment = require('moment');
const { ObjectId } = require('mongoose').Types;
const { Cruds } = require('src/common/handlers');
const { logger } = require('../../common/lib');
const {
  customerService,
  fxTransactionService,
  teamService,
  dealsService,
  rolesService,
  userService,
} = require('../services');
const TargetModel = require('./target.model');

class TargetService extends Cruds {
  async getTargets(userId, canGetAll) {
    const teams = await teamService.find({ managerId: userId });
    let filter = {};
    const memberIds = [];
    if (teams.length > 0) {
      // manager might manage multiple teams
      teams.forEach((team) => {
        memberIds.push(...team.members);
      });
      filter = {
        $or: [
          { userId: { $in: memberIds } },
          { userId },
        ],
      };
    } else if (!canGetAll) {
      filter = { userId };
    }
    const targets = await this.findWithPagination(filter, {
      populate: [{
        path: 'userId',
        select: '_id firstName lastName',
      }],
    });
    // eslint-disable-next-line no-restricted-syntax
    for (const target of targets.docs) {
      const found = await customerService.find(
        { agent: target.userId._id },
        {
          _id: 1, agent: 1, createdAt: 1, 'fx.isIb': 1, 'fx.liveAcc': 1, 'fx.isClient': 1,
        },
      );
      // TODO: get targets from my sql instead of mongo to get accurate data
      const total = await fxTransactionService.getDepositWithdrawSum(found);
      target.monthlyIbs = 0;
      target.monthlyClients = 0;
      target.achievedDeposits = total.deposit;
      target.achievedWithdrawals = total.withdraw;
      target.achievedVolume = 0;
      // agent might have multiple customers
      // eslint-disable-next-line no-restricted-syntax
      for (const customer of found) {
        if (new Date(customer.createdAt).getMonth() === new Date().getMonth()) {
          if (customer.agent.toString() === target.userId._id.toString()) {
            if (customer.fx.isIb) target.monthlyIbs += 1;
            if (customer.fx.isClient) target.monthlyClients += 1;
          }
        }
        if (customer.fx.liveAcc?.length > 0) {
          try {
            const closedLots = await dealsService.getClosedLotsForLogins(
              customer.fx.liveAcc,
              moment().startOf('month').toDate(),
              moment().endOf('month').toDate(),
            );
            target.achievedVolume += (closedLots[0].dataValues.lots / 10000);
          } catch (error) {
            logger.error(`Error in getting closed lots for login, ${customer.fx.liveAcc.toString()} ${error.message}`);
            target.achievedVolume = 0;
          }
        }
      }
    }
    return targets;
  }

  async getCanBeAssignedUsers() {
    const roles = await rolesService.find({ 'permissions.users.canBeAssigned': true });
    const roleIds = roles.map((role) => role._id);
    const users = await userService.findWithPagination({ roleId: { $in: roleIds } },
      {
        populate: [{
          path: 'targetId',
          select: '_id fx accounts ibAccounts volume',
        }],
      });
    return users;
  }

  async bulkUpdate(targets) {
    const promises = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const target of targets) {
      const { userId, ...rest } = target;
      if (!rest._id) {
        rest._id = new ObjectId();
        await userService.updateById(userId, { targetId: rest._id });
      }
      promises.push(this.createOrUpdate({ userId }, rest));
    }
    await Promise.all(promises);
    return targets;
  }
}

module.exports = new TargetService(TargetModel.Model, TargetModel.Schema);
