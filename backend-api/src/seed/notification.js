require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
// const { permissionsGroup } = require('src/common/data');
const { dbMongo, logger } = require('src/common/lib');
const { getInitialPushNotificationsSettings } = require('../modules/notifications/notifications.service');
const {
  rolesService: roleService,
  usersService,
  customerService,
} = require('../modules/services');

dbMongo();

// to reset the pushNotifications
// const newPushNotifications = [];

const updatePushNotificationInRoles = async () => {
  const roles = await roleService.find();
  const promiseArr = [];
  roles.forEach((obj) => {
    if (obj.pushNotifications) {
      const newPushNotifications = obj.pushNotifications.map((item) => {
        const newItem = getInitialPushNotificationsSettings('other').find((i) => i.type === item.type);
        return {
          ...newItem,
          ...item,
        };
      });
      promiseArr.push(roleService.updateById(obj._id, {
        pushNotifications: newPushNotifications,
      }, true));
    } else {
      logger.info(`Role ${obj._id} has no pushNotifications`);
    }
  });
  await Promise.all(promiseArr).catch((err) => {
    logger.error(`Error updating pushNotifications in roles: ${err}`);
  });
};

const updatePushNotificationInUsers = async () => {
  const users = await usersService.find();
  const promiseArr = [];
  users.forEach((obj) => {
    if (obj.settings && obj.settings.pushNotifications) {
      const newPushNotifications = new Set();
      obj.settings.pushNotifications.forEach((item) => {
        const existingItem = getInitialPushNotificationsSettings('customers').find((i) => item.key === i.key);
        if (existingItem) {
          // merge the actions of the existing item and the new item
          const newActions = new Set();
          existingItem.actions.forEach((action) => {
            const existingAction = item.actions.find((a) => a.action === action.action);
            if (existingAction) {
              newActions.add(existingAction);
            } else {
              newActions.add(action);
            }
          });
          const newItem = {
            ...existingItem,
            actions: Array.from(newActions),
          };
          newPushNotifications.add(newItem);
        } else {
          newPushNotifications.add(item);
        }
      });
      promiseArr.push(customerService.updateById(obj._id, {
        'settings.pushNotifications': Array.from(newPushNotifications),
      }, true));
    } else {
      logger.info(`User ${obj._id} has no settings or pushNotifications`);
    }
  });
  await Promise.all(promiseArr).catch((err) => {
    logger.error(`Error updating pushNotifications in users: ${err}`);
  });
};

const updatePushNotificationInCustomers = async () => {
  const customers = await customerService.find();
  const promiseArr = [];
  customers.forEach((obj) => {
    if (obj.settings && obj.settings.pushNotifications) {
      const newPushNotifications = new Set();
      obj.settings.pushNotifications.forEach((item) => {
        const existingItem = getInitialPushNotificationsSettings('customers').find((i) => item.key === i.key);
        if (existingItem) {
          const newActions = new Set();
          existingItem.actions.forEach((action) => {
            const existingAction = item.actions.find((a) => a.action === action.action);
            if (existingAction) {
              newActions.add(existingAction);
            } else {
              newActions.add(action);
            }
          });
          const newItem = {
            ...existingItem,
            actions: Array.from(newActions),
          };
          newPushNotifications.add(newItem);
        } else {
          newPushNotifications.add(item);
        }
      });
      promiseArr.push(customerService.updateById(obj._id, {
        'settings.pushNotifications': Array.from(newPushNotifications),
      }, true));
    } else {
      logger.info(`Customer ${obj._id} has no settings or pushNotifications`);
    }
  });
  await Promise.all(promiseArr).catch((err) => {
    logger.error(`Error updating pushNotifications in customers: ${err}`);
  });
};

const runSeeder = async () => {
  try {
    logger.info('===================STARTING BUILD===================');
    logger.info('===================UPDATING PUSH NOTIFICATIONS IN ROLES===================');
    await updatePushNotificationInRoles();
    logger.info('===================UPDATING PUSH NOTIFICATIONS IN USERS===================');
    await updatePushNotificationInUsers();
    logger.info('===================UPDATING PUSH NOTIFICATIONS IN CUSTOMER===================');
    await updatePushNotificationInCustomers();
    logger.info('==================BUILD DONE==================');
    process.exit();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    logger.info('================================================');
    logger.info('================================================');
    logger.info('================ERROR IN SEEDING================');
    logger.info('================================================');
    logger.info('================================================');
    logger.info('================================================');
    process.exit();
  }
};

runSeeder();
