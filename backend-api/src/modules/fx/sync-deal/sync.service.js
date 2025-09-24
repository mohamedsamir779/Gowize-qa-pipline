//
const { logger } = require('src/common/lib');
const moment = require('moment');

const {
  accountService,
  customerService,
} = require('src/modules/services');

const rmmm = require('src/rmq-publisher');

let dealService;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.getDealsForTimeFrame = async (login, hasIb, from, to) => {
  logger.info(['Fetching Deals for Login', login, from, to]);
  try {
    const data = await accountService.getAllDealsForLogin(
      login,
      from,
      to,
      'MT5',
    );
    await sleep(200);
    if (!data) {
      logger.info(['No Deals Found for Login', login]);
      return [];
    }
    return data.map((deal) => ({
      ...deal,
      hasIb,
    }));
  } catch (error) {
    logger.error(['Error Fetching Deals for Login', login, error?.message]);
    return [];
  }
};

const getDbSyncDeals = async (logins, from, to) => {
  const promises = [];
  for (let i = 0; i < logins.length; i += 1) {
    const { login, hasIb } = logins[i];
    promises.push(this.getDealsForTimeFrame(login, hasIb, from, to));
  }
  return Promise.all(promises);
};

const processDeals = async (deals) => {
  const processedDeals = [];
  for (let i = 0; i < deals.length; i += 1) {
    const deal = deals[i];
    const mysqlDeal = await dealService.getDealById(deal.dealId, true);
    const isDealPresentInDb = mysqlDeal !== null;
    let isIbDealProcessed = null;
    if (deal.hasIb) {
      const ibDeal = await dealService.getDealByClientDealId(deal.dealId);
      isIbDealProcessed = ibDeal !== null;
    }
    processedDeals.push({
      ...deal,
      isDealPresentInDb,
      isIbDealProcessed,
    });
  }
  return processedDeals;
};

const hasIbs = async (logins) => {
  const ibs = [];
  for (let i = 0; i < logins.length; i += 1) {
    const login = logins[i];
    const account = await accountService.findOne({
      login,
    }, 'login accountTypeId platform', {
      populate: [{
        path: 'customerId',
        select: 'fx _id parentId',
        model: 'customers',
        populate: {
          path: 'fx.agrementId',
          // select: 'f',
          model: 'IbAgrement',
        },
      }],
    });
    if (account) {
      if (account.customerId.parentId) {
        ibs.push({
          login,
          hasIb: true,
        });
      } else {
        ibs.push({
          login,
          hasIb: false,
        });
      }
    }
  }
  return ibs;
};

module.exports.getDeals = async (params) => {
  const {
    syncType,
    ibLogins,
    clientLogins,
    dateFrom,
    dateTo,
  } = params;
  logger.info(['Getting Deals', syncType, ibLogins, clientLogins, dateFrom, dateTo]);
  // dateFrom is in format YYYY-MM-DDTHH:mm we need to convert to miliseconds
  const from = moment(dateFrom).valueOf();
  const to = moment(dateTo).valueOf();
  const logins = await hasIbs([
    ...clientLogins,
    ...ibLogins,
  ]);
  for (let i = 0; i < ibLogins.length; i += 1) {
    const ib = ibLogins[i];
    const acc = await accountService.findOne({
      login: ib,
    });
    if (acc) {
      const clients = await customerService.getClientLiveAccs(acc?.customerId, 'MT5');
      if (clients.length > 0) {
        logins.push(...clients.map((client) => ({
          login: client.login,
          hasIb: true,
        })));
      } else {
        logger.info(['No Clients Found for IB', ib]);
      }
    } else {
      logger.info(['No Account Found for IB', ib]);
    }
  }
  const nonDuplicateLogins = [];
  for (let i = 0; i < logins.length; i += 1) {
    const login = logins[i];
    const index = nonDuplicateLogins.findIndex((l) => l.login === login.login);
    if (index === -1) {
      nonDuplicateLogins.push(login);
    }
  }
  const deals = await getDbSyncDeals(nonDuplicateLogins, from, to);
  // deals are in 2 d array we need to flatten it
  const flatDeals = deals.flat();
  logger.info(['Deals Fetched', flatDeals.length]);
  return processDeals(flatDeals?.filter(
    (deal) => (deal.symbol !== '') && (deal.action === 0 || deal.action === 1),
  ));
};

module.exports.syncDeals = async ({ deals }) => {
  logger.info(['Syncing Deals', deals.length]);
  const dealsPushed = [];
  for (let i = 0; i < 2; i++) {
    const dealT = deals[i];
    const foundDeal = await dealService.getDealById(dealT.dealId);
    if (!foundDeal) {
      const type = dealT.action > 1 ? dealT.action : dealT.entry;
      dealsPushed.push({
        dealId: dealT.dealId,
        type,
      });
      await rmmm.pushData(dealT, type);
      await sleep(900);
      logger.info(`Pushed Deal to Queue, DealId: ${dealT.dealId}`);
    } else {
      logger.info(`Deal found in DB, DealId: ${dealT.dealId}`);
      logger.info(`Checking the Ib Deal: ${dealT.dealId}`);
      const ibDeal = await dealService.getDealByClientDealId(dealT.dealId);
      if (!ibDeal) {
        // delete the deal in the db and push it to the queue
        logger.info(`Ib Deal not found in DB, DealId: ${dealT.dealId}`);
        const type = dealT.action > 1 ? dealT.action : dealT.entry;
        logger.info(`Deleting Deal from DB, DealId: ${dealT.dealId}`);
        await dealService.deleteDealByDealId(dealT.dealId);
        dealsPushed.push({
          dealId: dealT.dealId,
          type,
        });
        await rmmm.pushData(dealT, type);
        await sleep(900);
      } else {
        logger.info(`Ib Deal found in DB, DealId: ${dealT.dealId} - ${ibDeal.dealId}`);
      }
    }
    logger.info(`Deals Pushed: ${dealsPushed.length}`);
    logger.info(`Deals to Push: ${JSON.stringify(dealsPushed)}`);
  }
  return dealsPushed;
};

setTimeout(() => {
  dealService = require('src/modules/services').dealsService;
}, 0);
