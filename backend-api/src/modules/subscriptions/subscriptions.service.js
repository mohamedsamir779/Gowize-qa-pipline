const mongoose = require('mongoose');
const { CONSTANTS } = require('src/common/data');
const { Cruds, SendEvent } = require('src/common/handlers');
const { logger } = require('../../common/lib');
const SubscriptionsModel = require('./subscriptions.model');

const {
  EVENT_TYPES,
  LOG_TYPES,
  LOG_LEVELS,
} = CONSTANTS;
const LOG_TAG = 'SubscriptionsService';

class SubscriptionsService extends Cruds {
  async subscribeCPPushNotification(params = {}, user) {
    if (!user) {
      throw new Error('User ID is required');
    }
    const clientId = mongoose.Types.ObjectId(user._id);
    const findSubscription = await this.findOne({
      clientId,
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.SUBSCRIBE_PUSH_NOTIFICATION,
      {
        customerId: clientId,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    if (findSubscription) {
      logger.info(`${LOG_TAG}: Subscriptions already exists for customer ${clientId}`);
      const subscription = await this.updateById(findSubscription._id, {}, {
        push: {
          subscriptions: {
            ...params,
          },
        },
      });
      return subscription;
    }
    logger.info(`${LOG_TAG}: No Subscriptions exist for customer ${clientId}`);

    const subscription = await this.create({
      clientId,
      clientModel: 'customers',
      subscriptions: [{
        ...params,
      }],
    });
    return subscription;
  }

  async unsubscribeCPPushNotification(params = {}, user) {
    if (!user) {
      throw new Error('User ID is required');
    }
    logger.info(`${LOG_TAG}: Unsubscribe push notification for customer ${user._id}`);
    const clientId = mongoose.Types.ObjectId(user._id);
    const findSubscription = await this.findOne({
      clientId,
      'subscriptions.endpoint': params.endpoint,
    });
    if (findSubscription) {
      logger.info(`${LOG_TAG}: Found push notification url for customer: ${clientId} and endpoint: ${params.endpoint}`);
      const subscription = await this.updateById(findSubscription._id, {}, {
        pull: {
          subscriptions: {
            endpoint: params.endpoint,
          },
        },
      });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UNSUBSCRIBE_PUSH_NOTIFICATION,
        {
          customerId: clientId,
          userId: null,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: params,
        },
      );
      return subscription;
    }
    logger.info(`${LOG_TAG}: No push notification url found for customer: ${clientId}`);
    return null;
  }

  async subscribeCRMPushNotification(params = {}, user) {
    if (!user) {
      throw new Error('User ID is required');
    }
    const clientId = mongoose.Types.ObjectId(user._id);
    const findSubscription = await this.findOne({
      clientId,
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.SUBSCRIBE_PUSH_NOTIFICATION,
      {
        customerId: null,
        userId: clientId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    if (findSubscription) {
      logger.info(`${LOG_TAG}: Subscriptions already exists for user ${clientId}`);
      const subscription = await this.updateById(findSubscription._id, {}, {
        push: {
          subscriptions: {
            ...params,
          },
        },
      });
      return subscription;
    }
    logger.info(`${LOG_TAG}: No Subscriptions exist for user ${clientId}`);
    const subscription = await this.create({
      clientId,
      clientModel: 'users',
      subscriptions: [{
        ...params,
      }],
    });
    return subscription;
  }

  async unsubscribeCRMPushNotification(params = {}, user) {
    if (!user) {
      throw new Error('User ID is required');
    }
    logger.info(`${LOG_TAG}: Unsubscribe push notification for user ${user._id}`);
    const clientId = mongoose.Types.ObjectId(user._id);
    const findSubscription = await this.findOne({
      clientId,
      'subscriptions.endpoint': params.endpoint,
    });
    if (findSubscription) {
      logger.info(`${LOG_TAG}: Found push notification url for client: ${clientId} and endpoint: ${params.endpoint}`);
      const subscription = await this.updateById(findSubscription._id, {}, {
        pull: {
          subscriptions: {
            endpoint: params.endpoint,
          },
        },
      });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UNSUBSCRIBE_PUSH_NOTIFICATION,
        {
          customerId: null,
          userId: clientId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: params,
        },
      );
      return subscription;
    }
    logger.info(`${LOG_TAG}: No push notification url found for client: ${clientId}`);
    return null;
  }
}

module.exports = new SubscriptionsService(SubscriptionsModel.Model, SubscriptionsModel.Schema);
