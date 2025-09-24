//
const BN = require('bignumber.js');
const {
  Cruds,
  SendEvent,
  getAssetsFromMarketSymbol,
} = require('src/common/handlers');
const BlockChain = require('src/modules/crypto/blockchain');
const { logger } = require('src/common/lib');
const { CONSTANTS, keys } = require('src/common/data');
const allServices = require('src/modules/services');

const {
  feeGroupService,
  pricingService,
} = allServices;
const WalletModel = require('./wallet.model');
const AssetModel = require('./asset/asset.model');

const { currentEnvironment } = keys;

class WalletService extends Cruds {
  async checkWalletParams(params = {}, findAndReturnAsset = false) {
    const {
      belongsTo,
      asset,
    } = params;
    if (!belongsTo) throw new Error('This Wallet needs to belong to someone');
    const walletExists = await this.findOne({
      belongsTo,
      asset: asset.symbol,
    });
    if (walletExists) throw new Error(`This customer ${belongsTo} already has a ${asset.symbol} wallet`);
    if (findAndReturnAsset) {
      const foundAsset = await AssetModel.Model.findOne({
        symbol: asset.symbol,
        active: true,
      });
      if (!foundAsset) throw new Error('Asset does not exist or is inactive');
      return foundAsset;
    }
    return true;
  }

  async createCryptoWallet(params = {}, checkParams = true) {
    const {
      belongsTo,
      asset,
    } = params;
    if (checkParams) await this.checkWalletParams(params);
    const currentBlockChain = new BlockChain(asset.symbol, currentEnvironment !== 'production');
    const {
      privateKey: pk,
      publicKey: puk,
      mnemonic,
      xpub,
      tatumVirtualId,
      derivationKey,
    } = await currentBlockChain.generateWallet();
    // TODO: need to encrypt the wallet data and change the place where this is saved
    const wallet = {
      pk,
      puk,
      mnemonic,
      belongsTo,
      isCrypto: true,
      asset: asset.symbol,
      assetId: asset._id,
      xpub,
      tatumVirtualId,
      derivationKey,
    };
    logger.info(`Created Crypto (${asset.symbol}) wallet for ${belongsTo}, Address: ${puk}, Requested by ${params.createdBy || 'System'}`);
    return this.create(wallet);
  }

  async createFiatWallet(params = {}, checkParams = true) {
    const {
      belongsTo,
      asset,
    } = params;
    if (checkParams) await this.checkWalletParams(params);
    // TODO: need to encrypt the wallet data and change the place where this is saved
    const wallet = {
      pk: null,
      puk: null,
      xpub: null,
      tatumVirtualId: null,
      mnemonic: null,
      belongsTo,
      isCrypto: false,
      asset: asset.symbol,
      assetId: asset._id,
    };
    logger.info(`Created Fiat (${asset.symbol}) wallet for ${belongsTo}, Requested by ${params.createdBy || 'System'}`);
    return this.create(wallet);
  }

  async generateWallet(params = {}) {
    try {
      const asset = await this.checkWalletParams({
        ...params,
        asset: {
          symbol: params.symbol,
        },
      }, true);
      let wallet = {};
      if (asset.isCrypto) {
        wallet = this.createCryptoWallet({
          asset,
          belongsTo: params.customerId,
        }, false);
      }
      wallet = this.createFiatWallet({
        asset,
        belongsTo: params.customerId,
      }, false);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WALLET,
        {
          customerId: params.customerId,
          userId: params.createdBy,
          triggeredBy: 1,
          userLog: true,
          level: CONSTANTS.LOG_LEVELS.DEBUG,
          details: {},
          content: {
            ...params,
            asset: params.symbol,
          },
        },
      );
      return wallet;
    } catch (error) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WALLET,
        {
          customerId: params.customerId,
          userId: params.createdBy,
          triggeredBy: 1,
          userLog: true,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: error.message,
          },
          content: {
            ...params,
            asset: params.symbol,
          },
        },
      );
      throw error;
    }
  }

  async generateSystemWallets(params = {}) {
    const assets = await AssetModel.Model.find({
      active: true,
    });
    const symbols = assets.map((x) => x.symbol);
    const promises = assets.map((asset) => {
      if (asset.isCrypto) {
        return this.createCryptoWallet({
          asset,
          belongsTo: params.customerId,
        });
      }
      return this.createFiatWallet({
        asset,
        belongsTo: params.customerId,
      });
    });
    const walletCreationData = await Promise.allSettled(promises);
    return walletCreationData.map((walletData, index) => {
      let message = '';
      if (walletData.status === 'rejected') {
        message = `Creation of wallet (${symbols[index]}) failed due to ${walletData.reason.message}`;
        SendEvent(
          CONSTANTS.EVENT_TYPES.EVENT_LOG,
          CONSTANTS.LOG_TYPES.WALLET,
          {
            customerId: params.customerId,
            userId: params.createdBy,
            triggeredBy: params.createdBy ? 1 : null,
            userLog: true,
            level: CONSTANTS.LOG_LEVELS.ERROR,
            details: {
              error: message,
            },
            content: {
              ...params,
              asset: symbols[index],
            },
          },
        );
      } else {
        message = `Creation of (${symbols[index]}) was successful, Address: ${walletData.value.puk}`;
        SendEvent(
          CONSTANTS.EVENT_TYPES.EVENT_LOG,
          CONSTANTS.LOG_TYPES.WALLET,
          {
            customerId: params.customerId,
            userId: params.createdBy,
            triggeredBy: params.createdBy ? 1 : null,
            userLog: true,
            level: CONSTANTS.LOG_LEVELS.DEBUG,
            details: {},
            content: {
              ...params,
              asset: symbols[index],
            },
          },
        );
      }
      logger.info(message);
      return {
        asset: symbols[index],
        created: walletData.status === 'fulfilled',
        address: walletData.value && walletData.value.puk,
        message,
      };
    });
  }

  async changeBalanceViaWalletId(walletId, customerId, side, amount, mFee = {}) {
    if (!walletId) {
      throw new Error('Wallet Id is requried');
    }
    if (!side) {
      throw new Error('Side is required');
    }
    if (
      side !== CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW
      && side !== CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT) {
      throw new Error('Incorrect Side');
    }
    amount = new BN(amount);
    let paid;
    const found = await this.findOne({
      _id: walletId,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    if (!found.active) {
      throw new Error('This wallet is inactive');
    }
    let newAmount = new BN(found.amount);
    let newFrozen = new BN(found.freezeAmount);
    mFee = new BN(mFee.cost || 0);
    if (side === 'DEPOSIT') {
      paid = amount.minus(mFee);
      newAmount = newAmount.plus(paid);
      logger.info(`Deposited ${amount.minus(mFee).toString()} to ${customerId} Wallet (${found.asset}), ${found._id}, Fee Amount: ${mFee.toString()}`);
    } else if (side === 'WITHDRAW') {
      if (amount > newAmount) {
        throw new Error('Insufficient Balance');
      }
      newFrozen = newFrozen.minus(amount);
      paid = amount.minus(mFee);
      logger.info(`Withdraw ${amount} from ${customerId} Wallet (${found.asset}) (frozen balance), ${found._id}`);
    }
    await this.updateById(walletId, {
      amount: newAmount.toString(),
      freezeAmount: newFrozen.toString(),
    });
    return paid;
  }

  getDeductableAmount(side, price, amount) {
    let deductibleAmount = new BN(0);
    // TODO: price and amount are BSON type need to convert it to decimal here
    const pBN = new BN(price);
    const aBN = new BN(amount);
    deductibleAmount = side === 'buy' ? pBN.multipliedBy(aBN) : aBN;
    return deductibleAmount;
  }

  async moveBalanceFromFrozenForTrade(trade) {
    const {
      symbol,
      customerId,
      side,
      amount,
      price,
      mPrice,
      orderId,
      markup,
      frozenAmount,
      remaining,
      feeData,
    } = trade;
    const assets = getAssetsFromMarketSymbol(symbol);
    const [
      baseAssetWalletDocPromise,
      quoteAssetWalletPromise,
    ] = await Promise.allSettled([this.findOne({
      asset: assets.baseAsset,
      belongsTo: customerId,
    }), this.findOne({
      asset: assets.quoteAsset,
      belongsTo: customerId,
    })]);
    // eslint-disable-next-line max-len
    if (!baseAssetWalletDocPromise.value || (baseAssetWalletDocPromise.value && !baseAssetWalletDocPromise.value.asset)) {
      throw new Error(`${assets.baseAsset} Wallet not found for customer, ${customerId}`);
    }
    if (!baseAssetWalletDocPromise.value.active) {
      throw new Error(`This wallet is inactive, ${assets.baseAsset}`);
    }
    if (
      !quoteAssetWalletPromise.value
      || (quoteAssetWalletPromise.value && !quoteAssetWalletPromise.value.asset)
    ) {
      throw new Error(`${assets.quoteAsset} Wallet not found for customer, ${customerId}`);
    }
    if (!quoteAssetWalletPromise.value.active) {
      throw new Error(`This wallet is inactive, ${assets.quoteAsset}`);
    }
    const baseAssetWallet = baseAssetWalletDocPromise.value;
    const quoteAssetWallet = quoteAssetWalletPromise.value;
    if (side === 'buy') {
      // remove cost (amount * price) from quote frozen
      const quoteBN = new BN(quoteAssetWallet.freezeAmount);
      const deductibleAmount = this.getDeductableAmount(side, mPrice, amount);
      const newFrozenAmount = quoteBN.minus(deductibleAmount);
      logger.info(`Deducted amount ${deductibleAmount}, 
      from asset ${quoteAssetWallet.asset} 
      for customer, ${customerId} 
      for order, ${trade.orderId}`);
      await this.updateById(quoteAssetWallet._id, {
        freezeAmount: newFrozenAmount.toFixed(),
      });
      // added amount to base wallet
      const baseBN = new BN(baseAssetWallet.amount);
      let feeAmount = feeGroupService.calculateFeeAmount(feeData, amount);
      if (new BN(feeAmount).isGreaterThan(amount)) {
        feeAmount = 0;
        logger.info(`Fee Amount (${feeAmount.toString()}) set to 0 since it is greater than amount ${amount.toString()}`);
      }
      logger.info(`Fee Amount: ${feeAmount.toString()} Asset: ${baseAssetWallet.asset}`);
      const newBaseAmount = baseBN.plus(new BN(amount).minus(feeAmount));
      logger.info(`Added amount ${new BN(amount).minus(feeAmount).toString()}, 
      to asset ${baseAssetWallet.asset} 
      for customer, ${customerId} 
      for order, ${trade.orderId}`);
      await this.updateById(baseAssetWallet._id, {
        amount: newBaseAmount.toFixed(),
      });
      return {
        mCommission: feeAmount,
        mCommissionAsset: baseAssetWallet.asset,
      };
    }
    if (side === 'sell') {
      // remove amount from base frozen
      const baseBN = new BN(baseAssetWallet.freezeAmount);
      const newFrozenAmount = baseBN.minus(new BN(amount));
      logger.info(`Deducted amount ${new BN(amount).toString()}, 
      from asset ${baseAssetWallet.asset} 
      for customer, ${customerId} 
      for order, ${trade.orderId}`);
      await this.updateById(baseAssetWallet._id, {
        freezeAmount: newFrozenAmount.toFixed(),
      });
      // added cost (amount * price) to qoute wallet
      const deductibleAmount = this.getDeductableAmount(side, mPrice, amount);
      const quoteBN = new BN(quoteAssetWallet.amount);
      let feeAmount = feeGroupService.calculateFeeAmount(feeData, deductibleAmount);
      feeAmount = new BN(feeAmount).multipliedBy(mPrice);
      if (new BN(feeAmount).isGreaterThan(new BN(deductibleAmount).multipliedBy(mPrice))) {
        logger.info(`Fee Amount (${feeAmount.toString()}) set to 0 since it is greater than amount ${deductibleAmount.toString()}`);
        feeAmount = 0;
      }
      logger.info(`Fee Amount: ${feeAmount.toString()} Asset: ${quoteAssetWallet.asset}`);
      const newQuoteAmount = quoteBN.plus(
        new BN(deductibleAmount).multipliedBy(mPrice).minus(feeAmount),
      );
      logger.info(`Added amount ${new BN(deductibleAmount).multipliedBy(mPrice).minus(feeAmount).toString()}, 
      from asset ${quoteAssetWallet.asset} 
      for customer, ${customerId} 
      for order, ${trade.orderId}`);
      await this.updateById(quoteAssetWallet._id, {
        amount: newQuoteAmount.toFixed(),
      });
      return {
        mCommission: feeAmount,
        mCommissionAsset: quoteAssetWallet.asset,
      };
    }
  }

  async freezeAmountForOrder(order) {
    const {
      symbol,
      customerId,
      type,
      side,
      cost,
      price,
      mPrice,
    } = order;
    const amount = new BN(order.amount);
    const assets = getAssetsFromMarketSymbol(symbol);
    const asset = side === 'buy' ? assets.quoteAsset : assets.baseAsset;
    const found = await this.findOne({
      asset,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    if (!found.active) {
      throw new Error('This wallet is inactive');
    }
    let newFrozenAmount = new BN(found.freezeAmount);
    let newAmount = new BN(found.amount);
    // TODO: get the market price of the asset from our system
    const deductibleAmount = this.getDeductableAmount(side, mPrice, amount);
    newFrozenAmount = newFrozenAmount.plus(deductibleAmount);
    newAmount = newAmount.minus(deductibleAmount);
    logger.info(`Frozen ${deductibleAmount} from ${customerId} Wallet (${asset}), for order ${order._id}`);
    await this.updateById(found._id, {
      amount: newAmount.toFixed(),
      freezeAmount: newFrozenAmount.toFixed(),
    });
    return deductibleAmount;
  }

  async revertFrozenAmountForOrder(order) {
    const {
      symbol,
      customerId,
      type,
      side,
      amount,
      cost,
      price,
      mPrice,
    } = order;
    const assets = getAssetsFromMarketSymbol(symbol);
    const asset = side === 'buy' ? assets.quoteAsset : assets.baseAsset;
    const found = await this.findOne({
      asset,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    let newFrozenAmount = new BN(found.freezeAmount);
    let newAmount = new BN(found.amount);
    const fee = 0.1;
    const deductibleAmount = this.getDeductableAmount(side, mPrice, amount, fee);
    newFrozenAmount = newFrozenAmount.minus(deductibleAmount);
    newAmount = newAmount.plus(deductibleAmount);
    logger.info(`Reverted Frozen Amount, ${deductibleAmount} from ${customerId} Wallet (${asset}), for order ${order._id}`);
    await this.updateById(found._id, {
      amount: newAmount.toFixed(),
      freezeAmount: newFrozenAmount.toFixed(),
    });
    return this.findOne({
      _id: found._id,
      belongsTo: customerId,
    });
  }

  async freezeBalanceForOrder(asset, customerId, amount, orderId) {
    amount = new BN(amount);
    if (!asset) {
      throw new Error('Wallet Id is requried');
    }
    const found = await this.findOne({
      asset,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    if (!found.active) {
      throw new Error('This wallet is inactive');
    }
    let newFrozenAmount = new BN(found.freezeAmount);
    let newAmount = new BN(found.amount);
    newFrozenAmount = newFrozenAmount.plus(amount);
    newAmount = newAmount.minus(amount);
    logger.info(`Frozen ${amount} from ${customerId} Wallet (${found.asset}), for order ${orderId}`);
    await this.updateById(found._id, {
      amount: newAmount.toFixed(),
      freezeAmount: newFrozenAmount.toFixed(),
    });
    return this.findOne({
      _id: found._id,
      belongsTo: customerId,
    });
  }

  async freezeBalanceForWithdrawal(params = {}) {
    let {
      walletId,
      customerId,
      amount,
    } = params;
    if (!walletId) {
      throw new Error('Wallet Id is requried');
    }
    amount = new BN(amount);
    const found = await this.findOne({
      _id: walletId,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    if (!found.active) {
      throw new Error('This wallet is inactive');
    }
    if (new BN(found.amount).isLessThan(amount)) {
      throw new Error('Insufficient Balance');
    }
    let newFrozenAmount = new BN(found.freezeAmount);
    let newAmount = new BN(found.amount);
    newFrozenAmount = newFrozenAmount.plus(amount);
    newAmount = newAmount.minus(amount);
    logger.info(`Frozen ${amount} from ${customerId} Wallet (${found.asset}), for transaction`);
    await this.updateById(found._id, {
      amount: newAmount.toString(),
      freezeAmount: newFrozenAmount.toString(),
    });
    return this.findOne({
      _id: found._id,
      belongsTo: customerId,
    });
  }

  async getCPWalletdata(params = {}) {
    const find = await this.find({ belongsTo: params.belongsTo }, {}, {
      populate: [{
        path: 'assetId',
        select: 'symbol image isCrypto',
      }],
    });
    const marketPrices = await pricingService.find({});
    const btc = marketPrices.find((mp) => mp.pairName === 'BTC/USDT');

    const d = find.map((wallet) => {
      const p = marketPrices.find((mp) => mp.pairName === `${wallet.asset}/USDT`);
      const usdPrice = p ? parseFloat(new BN(p.marketPrice).toString()) : 1;
      // eslint-disable-next-line max-len
      const usdValue = parseFloat(new BN(usdPrice).multipliedBy(new BN(wallet.amount || 0)).toString());
      const btcValue = parseFloat(new BN(usdValue).dividedBy(btc ? btc.marketPrice : 1).toString());
      return {
        ...wallet,
        marketPrice: usdPrice,
        usdValue,
        usdPrice,
        btcValue,
      };
    });
    return d;
  }

  async transferBalanceForConvert(params = {}) {
    const {
      fromAsset,
      toAsset,
      customerId,
      fromAssetPriceData,
      toAssetPriceData,
      feeData,
    } = params;
    let { amount } = params;
    amount = new BN(amount);
    const fromAssetPrice = new BN(fromAssetPriceData || 0);
    const toAssetPrice = new BN(toAssetPriceData || 1);
    let toAmount = amount.multipliedBy(fromAssetPrice).dividedBy(toAssetPrice);
    const fromWallet = await this.findOne({
      asset: fromAsset,
      belongsTo: customerId,
    });
    const newFromAmount = new BN(fromWallet.amount).minus(amount);
    await this.updateById(fromWallet._id, {
      amount: newFromAmount.toString(),
    });
    let feeAmount = feeGroupService.calculateFeeAmount(feeData, toAmount);
    if (new BN(feeAmount).isGreaterThan(new BN(toAmount))) {
      logger.info(`Fee Amount (${feeAmount.toString()}) set to 0 since it is greater than amount ${toAmount.toString()}`);
      feeAmount = 0;
    }
    logger.info(`Fee Amount: ${feeAmount.toString()} Asset: ${toAsset}`);
    toAmount = toAmount.minus(feeAmount);
    const toWallet = await this.findOne({
      asset: toAsset,
      belongsTo: customerId,
    });
    const newToAmount = new BN(toWallet.amount).plus(toAmount);
    await this.updateById(toWallet._id, {
      amount: newToAmount.toString(),
    });
    return {
      cost: feeAmount.toString(),
      currency: toAsset,
      toAmount: toAmount.toString(),
    };
  }
}

module.exports = new WalletService(WalletModel.Model, WalletModel.Schema);
