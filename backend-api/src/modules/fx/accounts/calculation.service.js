//

const { reshapeAgrement } = require('src/common/handlers');
const { mt4Servie, mt5Servie } = require('../_connection');
const { logger } = require('src/common/lib');
const { getPlatform } = require('src/common/lib/helper');
let dealsService;
let walletService;

//const getPlatform = (platform = 'MT5') => (platform === 'MT5' ? mt5Servie : mt4Servie);

module.exports.runCommission = async (agrement, account, deal, useWallet = true) => {
  const agObj = reshapeAgrement(account.customerId.parentId, account.accountTypeId, agrement);
  const productType = await dealsService.getProductType(deal.symbol);

  let totalCommission = 0;
  const commissionPromiseArr = [];
  agObj.forEach((obj) => {
    console.log("Product: ",obj.values.products[productType]);
    if (obj.values.products[productType]) {
      totalCommission += (deal.volume /*/ 10000*/) * obj.values.products[productType].commission;
      if (useWallet) {
        logger.info(`Product Type => ${productType}`);            
        logger.info(`Comission Rate => ${obj.values.products[productType].commission}`);
        logger.info(`Comission => ${totalCommission}`);
        commissionPromiseArr.push(
          (async () => {
            const wallet = await walletService.addCommissionToWallet({
              customerId: obj.customerId,
              amount: totalCommission, // (deal.volume /*/ 10000*/) * obj.values.products[productType].commission,
              currency: account.currency,
            });
            const clientDeal = await dealsService.getDealById(deal.dealId);
            await dealsService.createMT5({
              dealId: parseInt(`${deal.dealId}0${Math.floor(new Date().getTime() / 10000)}`, 10),
              time: Math.floor(Date.now() / 1000),
              walletId: wallet._id?.toString(),
              entry: 0,
              action: 18,
              volume: 0,
              profit: totalCommission, //(deal.volume /*/ 10000*/) * obj.values.products[productType].commission,
              volumeClosed: 0,
              comment: `A:${wallet?._id}_D:${deal.dealId}`,
              clientDealId: deal.dealId,
              clientLogin: deal.login,
              clientEntry: deal.entry,
              clientVolume: clientDeal.volume,
              clientVolumeClosed: clientDeal.volumeClosed,
              platform: 0,
            });
          })(),
        );
      } else {
        commissionPromiseArr.push(
          getPlatform(account.platform).makeCommission(
            deal.login,
            deal.dealId,
            (deal.volume / 10000) * obj.values.products[productType].commission,
            account.platform === 'MT5' ? obj.ibMT5 : obj.ibMT4,
          ),
        );
      }
    }
  });
  //await getPlatform(account.platform).reduceCommission(deal.login, deal.dealId, totalCommission);
  await Promise.all(commissionPromiseArr);
  return true;
};

module.exports.runRebate = async (agrement, account, deal, useWallet = true) => {
  const agObj = reshapeAgrement(account.customerId.parentId, account.accountTypeId, agrement);
  const productType = await dealsService.getProductType(deal.symbol);

  const rebatePromiseArr = [];
  agObj.forEach((obj) => {
      if (useWallet) {
        rebatePromiseArr.push(
          (async () => {
            const rebateAmount = (deal.volume /*/ 10000*/)* obj.values.products[productType].rebate;
            logger.info(`Product Type => ${productType}`);
            logger.info(`Rebate Rate => ${obj.values.products[productType].rebate}`);        
            logger.info(`Rebate Amount =>  ${rebateAmount}`);  
            
            const wallet = await walletService.addRebateToWallet({
              customerId: obj.customerId,
              amount: rebateAmount,//(deal.volume /*/ 10000*/) * obj.values.products[productType].rebate,
              currency: account.currency,
            });
            const clientDeal = await dealsService.getDealById(deal.dealId);
            await dealsService.createMT5({
              dealId: parseInt(`${deal.dealId}0${Math.floor(new Date().getTime() / 10000)}`, 10),
              time: Math.floor(Date.now() / 1000),
              walletId: wallet._id?.toString(),
              entry: 0,
              action: 10,
              volume: 0,
              profit: rebateAmount, //(deal.volume /*/ 10000*/) * obj.values.products[productType].rebate,
              volumeClosed: 0,
              comment: `A:${wallet?._id}_D:${deal.dealId}`,
              clientDealId: deal.dealId,
              clientLogin: deal.login,
              clientEntry: deal.entry,
              clientVolume: clientDeal.volume,
              clientVolumeClosed: clientDeal.volumeClosed,
              platform: 0,
            });
          })(),
        );
      } else {
        rebatePromiseArr.push(
          getPlatform(account.platform).addRebate(
            deal.login,
            deal.dealId,
            (deal.volumeClosed /*/ 10000*/) * obj.values.products[productType].rebate,
            account.platform === 'MT5' ? obj.ibMT5 
              : account.platform === 'CTRADER' ? obj.ibCTRADER
               : obj.ibMT4,
          ),
        );
      }
  });
  const rebateArr = await Promise.all(rebatePromiseArr);
  return true;
};

setTimeout(() => {
  // eslint-disable-next-line global-require
  dealsService = require('src/modules/services').dealsService;
  walletService = require('src/modules/services').walletService;
}, 0);
