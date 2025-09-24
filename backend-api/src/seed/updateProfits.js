require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { dbMongo, logger } = require('src/common/lib');
const { Op } = require('sequelize');
const { Model } = require('src/modules/fx/deals/deals.model');
const { Types } = require('mongoose');
const {
  dealsService,
  ibAgrementService,
  accountService,
  walletService,
  customerService,
} = require('../modules/services');
 
dbMongo();
 
const fixProfit = async () => {
  const query = {
    action: {
      [Op.in]: [10, 18],
    },
  };
  const deals = await Model.findAll({
    where: query,
    raw: true,
  });
  for (let i = 0; i < deals.length; i += 1) {
    const deal = deals[i];
    const wallet = await walletService.findOne({
      _id: Types.ObjectId(deal.walletId),
    });
    const clientAccount = await accountService.findOne({
      login: deal.clientLogin.toString(),
    });
    if(!clientAccount){
        logger.error('===================FIXING PROFITS ERROR===================');
        logger.error(`Associated Client not found - Login: ${deal.clientLogin} | Deal ID: ${deal.clientDealId} | WalletID: ${deal.walletId}`)
        continue;
    }
    const clientDeal = await Model.findOne({
      where: {
        dealId: deal.clientDealId,
      },
      raw: true,
    });
    const customer = await customerService.findOne({
      _id: Types.ObjectId(clientAccount.customerId),
    });
    // sometimes this will be null handle this
    const agreement = await ibAgrementService.findOne({
      _id: Types.ObjectId(customer.fx.agrementId),
    });
    if(agreement){
        const { members } = agreement;
        const ib = members.find((member) => member.customerId?.toString() === wallet.belongsTo?.toString());
        // handle if can't find ib
        const { values } = ib;
        const products = values.find((value) => value.accountTypeId?.toString() === clientAccount.accountTypeId?.toString());
        const productType = await dealsService.getProductType(clientDeal.symbol);
        const prod = products.products[productType];
        const profit = deal.action === 10 ?
                        (clientDeal.volume ) * prod.rebate
                        : deal.action === 18 ?
                            (clientDeal.volume ) * prod.commission
                            :   clientDeal.profit ;
        await Model.update(
        { profit },
        {
            where: {
            dealId: deal.dealId,
            },
        },
        );
    }
  }
};
 
const runSeeder = async () => {
  try {
    logger.info('===================STARTING BUILD===================');
    logger.info('===================UPDATING PROFIT IN DEALS===================');
    await fixProfit();
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