require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { permissionsGroup } = require('src/common/data');
const { dbMongo, logger } = require('src/common/lib');
const { getInitialPushNotificationsSettings } = require('../modules/notifications/notifications.service');
const {
  rolesService: roleService,
  usersService,
  customerService,
} = require('../modules/services');

dbMongo();

const compilePermission = (obj, title) => {
  if (title !== 'Admin') return obj;
  const tmp = obj;
  Object.keys(tmp).forEach((key) => {
    tmp[key] = true;
  });
  return tmp;
};

const mergePermissions = (current = {}, title = '') => {
  const perm = {};
  Object.keys(permissionsGroup).forEach((obj) => {
    if (!current[obj]) {
      perm[obj] = compilePermission(permissionsGroup[obj], title);
    } else {
      perm[obj] = {
        ...compilePermission(permissionsGroup[obj], title),
        ...current[obj],
      };
    }
  });
  return perm;
};

const updateRoles = async () => {
  const roles = await roleService.find();
  const promiseArr = [];
  roles.forEach((obj) => {
    promiseArr.push(roleService.updateById(obj._id, {
      permissions: mergePermissions(obj.permissions, obj.title),
    }, true));
  });
  return Promise.all(promiseArr).then((res) => {
    logger.info(res);
    return res;
  }).catch((err) => {
    logger.error(err);
    throw err;
  });
};

const updatePushNotificationInRoles = async () => {
  const roles = await roleService.find();
  const promiseArr = [];
  roles.forEach((obj) => {
    if (!obj.pushNotifications || obj.pushNotifications.length === 0) {
      promiseArr.push(roleService.updateById(obj._id, {
        pushNotifications: getInitialPushNotificationsSettings('other'),
      }, true));
    }
  });
  await Promise.all(promiseArr).then((res) => {
    logger.info(res);
    return res;
  }).catch((err) => {
    logger.error(err);
  });
};

const updatePushNotificationInUsers = async () => {
  const users = await usersService.find();
  const promiseArr = [];
  users.forEach((obj) => {
    if ((obj.settings && !obj.settings.pushNotifications)
    || (obj.settings && obj.settings.pushNotifications.length === 0)) {
      promiseArr.push(usersService.updateById(obj._id, {
        'settings.pushNotifications': getInitialPushNotificationsSettings('users'),
      }, true));
    }
  });
  await Promise.all(promiseArr).then((res) => {
    logger.info(res);
    return res;
  }).catch((err) => {
    logger.error(err);
  });
};

const updatePushNotificationInCustomers = async () => {
  const customers = await customerService.find();
  const promiseArr = [];
  customers.forEach((obj) => {
    if ((obj.settings && !obj.settings.pushNotifications)
      || (obj.settings && obj.settings.pushNotifications.length === 0)) {
      promiseArr.push(customerService.updateById(obj._id, {
        'settings.pushNotifications': getInitialPushNotificationsSettings('customers'),
      }, true));
    }
  });
  await Promise.all(promiseArr).then((res) => {
    logger.info(res);
    return res;
  }).catch((err) => {
    logger.error(err);
  });
};

const runSeeder = async () => {
  try {
    logger.info('===================STARTNG BUILD===================');
    await updateRoles();
    logger.info('===================ADDING PUSH NOTIFICATIONS IN ROLES===================');
    await updatePushNotificationInRoles();
    logger.info('===================ADDING PUSH NOTIFICATIONS IN USERS===================');
    await updatePushNotificationInUsers();
    logger.info('===================ADDING PUSH NOTIFICATIONS IN CUSTOMER===================');
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
