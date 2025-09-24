require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { dbMongo, logger } = require('src/common/lib');
const { CONSTANTS } = require('src/common/data');
const {
  dictionaryService,
} = require('../modules/services');
const countriesData = require('./countries.json');

const { BINANCE_EXCHANGE } = CONSTANTS;

dbMongo();

const generateDefaultDictionary = async () => {
  const countries = countriesData;
  const exchanges = [BINANCE_EXCHANGE];
  const actions = Object.keys(CONSTANTS.EMAIL_ACTIONS).map((x) => CONSTANTS.EMAIL_ACTIONS[x]);
  const emailProviders = ['smtp', 'sendGrid'];
  const callStatus = Object.keys(CONSTANTS.CALL_STATUS).map((x) => CONSTANTS.CALL_STATUS[x]);
  const defaultCallStatusColors = CONSTANTS.DEFAULT_CALL_STATUS_COLOR_MAP;
  await dictionaryService.create({
    countries,
    exchanges,
    actions,
    emailProviders,
    callStatus,
    defaultCallStatusColors,
  });
};

const updateDict = async () => {
  const countries = countriesData;
  const exchanges = [BINANCE_EXCHANGE];
  const actions = Object.keys(CONSTANTS.EMAIL_ACTIONS).map((x) => CONSTANTS.EMAIL_ACTIONS[x]);
  const emailProviders = ['smtp', 'sendGrid'];
  const callStatus = Object.keys(CONSTANTS.CALL_STATUS).map((x) => CONSTANTS.CALL_STATUS[x]);
  const defaultCallStatusColors = CONSTANTS.DEFAULT_CALL_STATUS_COLOR_MAP;
  const chk = await dictionaryService.findOne();
  if (chk) {
    await dictionaryService.updateById(chk._id, {
      countries,
      exchanges,
      actions,
      emailProviders,
      callStatus,
      defaultCallStatusColors,
    });
  } else {
    await generateDefaultDictionary();
  }
};

const runSeeder = async () => {
  try {
    logger.info('===================UPDATING DICTIONARY===================');
    await updateDict();
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
