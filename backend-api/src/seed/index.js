require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const { CONSTANTS, keys } = require('src/common/data');
const { dbMongo, logger } = require('src/common/lib');

const { BINANCE_EXCHANGE } = CONSTANTS;

const {
  userService,
  roleService,
  customerService,
  walletService,
  assetService,
  dictionaryService,
  settingsService,
  accountTypeService,
  systemEmailService,
  chainService,
} = require('../modules/services');

const countriesData = require('./countries.json');
const systemEmailsData = require('./system-emails.json');
const chainsData = require('./chainData.json');
const assetData = require('./assetsData.json');
const assetsRequired = ['USD', 'USDT', 'ETH', 'TRX'];

dbMongo();

const makeAllPermissionsTrue = (permissions = {}) => {
  const perm = { ...permissions };
  Object.keys(perm).forEach((upperKey) => {
    Object.keys(perm[upperKey]).forEach((lowerKey) => {
      perm[upperKey][lowerKey] = true;
    });
  });
  perm.users.canBeTeamMember = false;
  perm.users.canBeTeamManager = false;
  return permissions;
};

const addAdminUser = async () => {
  const adminUser = CONSTANTS.USERS[0];
  const adminUserCheck = await userService.findOne({ email: adminUser.email });

  if (!adminUserCheck) {
    await userService.createUser({
      ...CONSTANTS.USERS[0],
      roleId: '62285f9cb1dd0355f4ef0481',
    });
    logger.info('------------------ADMIN USER ADDED---------------------');
  } else {
    logger.warn('------------------ADMIN USER ALREADY ADDED---------------------');
  }
};

const addAdminRole = async () => {
  const adminUser = await userService.findOne({ email: CONSTANTS.USERS[0].email });
  if (!adminUser) {
    logger.error('-------------------ADMIN ROLE DOES NOT EXIST---------------------');
  }
  const role = CONSTANTS.ROLES[0];
  const checkRole = await roleService.findOne({ key: role.key });
  if (!checkRole) {
    const addedRole = await roleService.createNewRole({ ...role, createdBy: adminUser._id });
    logger.info(`-------------------ROLE ${role.title} ADDED---------------------`);
    await roleService.Model.updateOne(
      { _id: ObjectId(addedRole._id) },
      { $set: { permissions: makeAllPermissionsTrue(addedRole.permissions) } },
    );
  } else {
    logger.warn(`-------------------ROLE ${role.title} ALREADY ADDED---------------------`);
  }
};

const updateAdminUserRole = async () => {
  const [adminUser, adminRole] = await Promise.all([
    userService.findOne({ email: CONSTANTS.USERS[0].email }),
    roleService.findOne({ title: CONSTANTS.ROLES[0].title }),
  ]);

  if (adminUser && adminRole) {
    if (adminUser.roleId !== adminRole._id) {
      await userService.Model.updateOne(
        { _id: ObjectId(adminUser._id) },
        { $set: { roleId: adminRole._id } },
      );
      logger.info('------------------ROLE OF ADMIN USER UPDATED TO ADMIN---------------------');
    }
  } else {
    logger.error('------------------ADMIN ROLE/USER NOT FOUND---------------------');
  }
};

const addCustomer = async () => {
  const chk = await customerService.findOne({ email: 'dxb@uae.com' });
  if (!chk) {
    await customerService.addLead({
      firstName: 'test',
      lastName: 'test',
      country: 'uae',
      nationality: 'uae',
      city: 'dxb',
      email: 'dxb@uae.com',
      phone: '+971567893434',
      dob: '01-01-1901',
      gender: 'male',
      password: 'dxb@123',
      category: 'FOREX',
      source: 'FOREX_LIVE',
    });
  }
};

const addChains = async () => {
  const chk = await chainService.findOne({});
  if (!chk) {
    let chains = chainsData;
    for (let i = 0; i< chains.length; i ++) {
      await chainService.create(chains[i]);
    }
  }
}

const addWallet = async () => {
  const chk = await walletService.findOne({ belongsTo: '62285f9cb1dd0355f4ef0481' });
  if (!chk) {
    await walletService.create({
      belongsTo: '62285f9cb1dd0355f4ef0481',
      assetId: '62285f9cb1dd0355f4ef0481',
      asset: 'USDT',
      isCrypto: true,
    });
  }
};

const addAsset = async () => {
  const chainData = await chainService.find();
  for (let i = 0; i < assetsRequired.length; i++) {
    let currentAsset = assetsRequired[i];
    const foundAssetData = assetData.find((x) => x.symbol === currentAsset);
    const chk = await assetService.findOne({ symbol: foundAssetData.symbol });
    if (!chk) {
      if (foundAssetData.networks) {
        for (j = 0; j < foundAssetData.networks.length; j++) {
          const currentChain = foundAssetData.networks[j];
          const chainId = chainData.find((x) => x.name === currentChain.name);
          foundAssetData.networks[j].chainId = chainId._id;
        }
      }
    }
    await assetService.create(foundAssetData);
  }
};

const generateDefaultDictionary = async () => {
  const countries = countriesData;
  const exchanges = [BINANCE_EXCHANGE];
  const actions = Object.keys(CONSTANTS.EMAIL_ACTIONS).map((x) => CONSTANTS.EMAIL_ACTIONS[x]);
  const emailProviders = ['smtp', 'sendGrid'];
  const callStatus = Object.keys(CONSTANTS.CALL_STATUS).map((x) => CONSTANTS.CALL_STATUS[x]);
  const defaultCallStatusColors = CONSTANTS.DEFAULT_CALL_STATUS_COLOR_MAP;
  const chk = await dictionaryService.findOne();
  if (!chk) {
    await dictionaryService.create({
      countries,
      exchanges,
      actions,
      emailProviders,
      callStatus,
      defaultCallStatusColors,
    });
  }
};

const generateDefaultSettings = async () => {
  const chk = await settingsService.findOne();
  if (!chk) {
    await settingsService.create({
      email: {
        currentProvider: '',
        sendGrid: {
          apiKey: '',
          fromEmail: '',
        },
        smtp: {
          fromEmail: '',
          server: '',
          port: 0,
          secure: false,
          user: '',
          password: '',
        },
      },
      defaultLanguage: 'en',
      exchanges: [{
        name: BINANCE_EXCHANGE,
        apiKey: '',
        secret: '',
        default: true,
        extraParams: {},
      }],
    });
  }
};

const generateDefaultSystemEmails = async () => {
  const chk = await systemEmailService.findOne();
  if (!chk) {
    for (let i = 0; i < systemEmailsData.length; i++) {
      const email = systemEmailsData[i];
      await systemEmailService.create(email);
    }
  }
};

const addAccountTypes = async () => {
  const typeService = accountTypeService;
  const promiseArr = [];
  CONSTANTS.STARTING_ACCOUNT_TYPES.forEach((obj) => {
    promiseArr.push(typeService.createOrUpdate({
      title: obj.title,
      platform: obj.platform,
    }, obj));
  });
  return Promise.allSettled(promiseArr);
};

const addIndexes = async () => {
  if (mongoose.connection.collections.customers) {
    await mongoose.connection.collections.customers.createIndexes({
      firstName: 'text',
      lastName: 'text',
      email: 'text',
      phone: 'text',
      country: 'text',
      'fx.liveAcc': 'text',
      'fx.demoAcc': 'text',
      'fx.ibCTRADERAcc': 'text',
      'fx.ibMt5Acc': 'text',
      'fx.ibMt4Acc': 'text',
      nationality: 'text',
      defaultPortal: 'text',
      defaultSubPortal: 'text',
      callStatus: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.users) {
    await mongoose.connection.collections.users.createIndexes({
      firstName: 'text', lastName: 'text', email: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.roles) {
    await mongoose.connection.collections.roles.createIndexes({
      title: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.assets) {
    await mongoose.connection.collections.assets.createIndexes({
      name: 'text', symbol: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.wallets) {
    await mongoose.connection.collections.wallets.createIndexes({
      asset: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.markets) {
    await mongoose.connection.collections.markets.createIndexes({
      name: 'text', baseAsset: 'text', quoteAsset: 'text', pairName: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.orders) {
    await mongoose.connection.collections.orders.createIndexes({
      symbol: 'text', status: 'text', type: 'text', side: 'text', exchange: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.transactions) {
    await mongoose.connection.collections.transactions.createIndexes({
      recordId: 'text',
      amount: 'text',
      status: 'text',
      currency: 'text',
      gateway: 'text',
      type: 'text',
      paid: 'text',
      note: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
  if (mongoose.connection.collections.transactionsfxes) {
    await mongoose.connection.collections.transactionsfxes.createIndexes({
      recordId: 'text',
      amount: 'text',
      status: 'text',
      currency: 'text',
      gateway: 'text',
      type: 'text',
      paid: 'text',
      note: 'text',
    }, { language_override: 'lang', name: 'generalIndex' });
  }
};

const runSeeder = async () => {
  try {
    logger.info('===================STARTNG SEEDING DATA===================');
    await addAdminUser();
    logger.info('===================USERS SEEDING DONE===================');
    await addAdminRole();
    logger.info('===================ROLES SEEDING DONE===================');
    await updateAdminUserRole();
    await addCustomer();
    logger.info('===================CUSTOMER SEEDING DONE===================');
    if (keys.enableCryptoWallets) {
      // TODO: need to add chains seeding as well
      await addChains();
      logger.info('===================CHAINS SEEDING DONE===================');
      await addAsset();
      logger.info('===================ASSET SEEDING DONE===================');
    }
    if (keys.enableCrypto) {
      await addWallet();
      logger.info('===================WALLET SEEDING DONE===================');
    }
    await generateDefaultDictionary();
    logger.info('===================DICTIIONARY SEEDING DONE===================');
    await generateDefaultSettings();
    logger.info('===================SETTINGS SEEDING DONE===================');
    await generateDefaultSystemEmails();
    logger.info('===================SYSTEM EMAILS SEEDING DONE===================');
    if (keys.enableFX) {
      await addAccountTypes();
      logger.info('===================Account Types SEEDING DONE===================');
    }
    // TODO: need to add system email seeding as well
    logger.info('===================ADDING INDEXES ON COLLECTIONS===================');
    await addIndexes();
    logger.info('===================ADDING INDEXES DONE===================');

    logger.info('================================================');
    logger.info('================================================');
    logger.info('==================SEEDING DONE==================');
    logger.info('================================================');
    logger.info('================================================');
    logger.info('================================================');
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
