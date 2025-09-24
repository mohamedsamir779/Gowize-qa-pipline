//
const BN = require('bignumber.js');
const {
  Cruds,
  SendEvent,
  getAssetsFromMarketSymbol,
  sleep,
} = require('src/common/handlers');
// const BlockChain = require('src/modules/crypto/blockchain');
const BlockChain = require('src/modules/crypto/newBlockchain');
const { logger, ibWalletLogger } = require('src/common/lib');
const { CONSTANTS, keys } = require('src/common/data');
const allServices = require('src/modules/services');
const { Types } = require('mongoose');

const {
  feeGroupService,
  pricingService,
} = allServices;
const WalletModel = require('./wallet.model');
const AssetModel = require('./asset/asset.model');
const { enableCrypto, enableCryptoWallets } = require('../../common/data/keys');

let chainService;
let addressService;
let addressTrackerService;
let cryptoAPIService;
let conversionRateService;

const { currentEnvironment } = keys;

const getNetwork = (chain, testnet = false) => {
  if (!testnet) {
    return 'mainnet';
  }
  switch (chain) {
    case 'ethereum':
      return 'goerli';
    case 'binance-smart-chain':
      return 'testnet';
    case 'tron':
      return 'nile';
    case 'ethereum-classic':
      return 'mordor';
    default:
      return 'testnet';
  }
};

class WalletService extends Cruds {
  constructor() {
    super(WalletModel.Model, WalletModel.Schema);
    this.LogTag = 'Wallet Service';
  }

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
      symbol: asset,
    } = params;
    if (!enableCryptoWallets) throw new Error('Crypto is not enabled');
    // if (checkParams) await this.checkWalletParams(params);
    const foundAsset = await AssetModel.Model.findOne({
      isCrypto: true,
      _id: Types.ObjectId(asset),
    }, {}, { lean: true });
    if (!foundAsset) throw new Error('Asset does not exist or is inactive');
    if (!foundAsset.networks || !foundAsset.networks.length) throw new Error('Asset does not have any networks');
    const chains = foundAsset.networks.map((network) => network.chainId);
    for (let i = 0; i < chains.length; i++) {
      const chain = await chainService.findOne({
        _id: Types.ObjectId(chains[i]),
      });
      try {
        const network = getNetwork(chain.cryptoapiName.toLowerCase(), true);
        let walletData = await cryptoAPIService.createDepositAddress(chain.cryptoapiName.toLowerCase(), network, '643e4d384dd5e90007b42588');
        const createdAddress = await addressService.create({
          address: walletData.data.data.item.address,
          chainId: chain._id,
        });
        await addressTrackerService.addNewAddress(
          chain._id, walletData.data.data.item.address, chain.symbol, false,
        );
        const wallet = await cryptoAPIService.createSubscriptionForAddress(
          chain.name.toLowerCase(), network, walletData.data.data.item.address,
        );
        if (chain.hasTokens) {
          await cryptoAPIService.createSubscriptionForToken(
            chain.name.toLowerCase(), network, walletData.data.data.item.address,
          );
        }
        await sleep(2000);
        const findWallet = await this.findOne({
          belongsTo,
          assetId: foundAsset._id.toString(),
        });
        if (findWallet) {
          await this.updateById(findWallet._id, {}, {
            push: {
              networks: createdAddress._id,
            },
          });
          logger.info(`Updated wallet of (${foundAsset.symbol}) for ${belongsTo}, with new network Address: ${createdAddress.address} (${chain.name}), Requested by ${params.createdBy || 'System'}`);
        } else {
          walletData = {
            networks: [createdAddress._id],
            belongsTo,
            asset: foundAsset.symbol,
            assetId: foundAsset._id,
            isCrypto: true,
          };
          this.create(walletData);
          logger.info(`Created Crypto (${foundAsset.symbol}) wallet for ${belongsTo}, Address: ${createdAddress.address}, Requested by ${params.createdBy || 'System'}`);
        }
      } catch (error) {
        console.log(error);
        logger.error(`${this.LogTag}: Error creating/linking wallet for ${belongsTo} on ${chain.name} ${chain.address}`);
      }
    }
  }

  async createCryptoWallets(params = {}, checkParams = true) {
    const {
      belongsTo,
    } = params;
    // if (checkParams) await this.checkWalletParams(params);
    if (!params.createdBy) params.createdBy = 'System';
    const chains = await chainService.find({ active: true });
    const assets = await AssetModel.Model.find({ isCrypto: true });
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      const findAssets = assets.filter(
        (ast) => ast.networks.find(
          (network) => network.chainId.toString() === chain._id.toString(),
        ),
      );
      if (!findAssets || findAssets.length === 0) {
        logger.warn(`${this.LogTag}: No asset found to create wallets for this chain: ${chain.name} ${chain.address}`);
      } else {
        try {
          const network = getNetwork(chain.cryptoapiName.toLowerCase(), true);
          let walletData = await cryptoAPIService.createDepositAddress(chain.cryptoapiName.toLowerCase(), network, '643e4d384dd5e90007b42588');
          const createdAddress = await addressService.create({
            address: walletData?.data?.data?.item?.address,
            chainId: chain._id,
          });
          await addressTrackerService.addNewAddress(
            chain._id, walletData?.data?.data?.item?.address, chain.symbol, false,
          );
          let coinSubscriptionReference;
          let tokenSubscriptionReference;
          const wallet = await cryptoAPIService.createSubscriptionForAddress(
            chain.name.toLowerCase(), network, walletData?.data?.data?.item?.address,
          );
          if (wallet) {
            coinSubscriptionReference = wallet.data?.data?.item?.referenceId;
          }
          if (chain.hasTokens) {
            const subsReference = await cryptoAPIService.createSubscriptionForToken(
              chain.name.toLowerCase(), network, walletData?.data?.data?.item?.address,
            );
            if (subsReference.data) {
              tokenSubscriptionReference = subsReference?.data?.data?.item?.referenceId;
            }
          }
          await addressService.updateById(createdAddress._id, {
            subscriptionReference: tokenSubscriptionReference,
            coinSubscriptionReference,
          });
          await sleep(2000);
          for (let j = 0; j < findAssets.length; j++) {
            const foundAsset = findAssets[j];
            const findWallet = await this.findOne({
              belongsTo,
              assetId: foundAsset._id.toString(),
            });
            if (findWallet) {
              await this.updateById(findWallet._id, {}, {
                push: {
                  networks: createdAddress._id,
                },
              });
              logger.info(`Updated wallet of (${foundAsset.symbol}) for ${belongsTo}, with new network Address: ${createdAddress.address} (${chain.name}), Requested by ${params.createdBy || 'System'}`);
            } else {
              walletData = {
                networks: [createdAddress._id],
                belongsTo,
                asset: foundAsset.symbol,
                assetId: foundAsset._id,
                isCrypto: true,
              };
              this.create(walletData);
              logger.info(`Created Crypto (${foundAsset.symbol}) wallet for ${belongsTo}, Address: ${createdAddress.address}, Requested by ${params.createdBy || 'System'}`);
            }
          }
        } catch (error) {
          logger.error(`${this.LogTag}: Error while creating wallet for chain: ${chain.name} ${chain.address}`);
          logger.error(error);
        }
      }
    }
  }

  async createCryptoWalletsOld(params = {}, checkParams = true) {
    const {
      belongsTo,
    } = params;
    // if (checkParams) await this.checkWalletParams(params);
    if (!params.createdBy) params.createdBy = 'System';
    const chains = await chainService.find({ active: true });
    const assets = await AssetModel.Model.find({ isCrypto: true });
    // TODO: need to encrypt the wallet data and change the place where this is saved
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i];
      const findAssets = assets.filter(
        (ast) => ast.networks.find(
          (network) => network.chainId.toString() === chain._id.toString(),
        ),
      );
      if (!findAssets || findAssets.length === 0) {
        logger.warn(`${this.LogTag}: No asset found to create wallets for this chain: ${chain.name} ${chain.address}`);
      } else {
        try {
          // add check for parent chain/asset here
          let walletData = await BlockChain.GetChainConnection(chain._id).GenerateKeyPairs();
          const createdAddress = await addressService.create({
            ...walletData,
            chainId: chain._id,
          });
          await addressTrackerService.addNewAddress(
            chain._id, walletData.address, chain.symbol, false,
          );
          await sleep(2000);
          for (let j = 0; j < findAssets.length; j++) {
            const foundAsset = findAssets[j];
            const findWallet = await this.findOne({
              belongsTo,
              assetId: foundAsset._id.toString(),
            });
            if (findWallet) {
              await this.updateById(findWallet._id, {}, {
                push: {
                  networks: createdAddress._id,
                },
              });
              logger.info(`Updated wallet of (${foundAsset.symbol}) for ${belongsTo}, with new network Address: ${createdAddress.address} (${chain.name}), Requested by ${params.createdBy || 'System'}`);
            } else {
              walletData = {
                networks: [createdAddress._id],
                belongsTo,
                asset: foundAsset.symbol,
                assetId: foundAsset._id,
                isCrypto: true,
              };
              this.create(walletData);
              logger.info(`Created Crypto (${foundAsset.symbol}) wallet for ${belongsTo}, Address: ${createdAddress.address}, Requested by ${params.createdBy || 'System'}`);
            }
          }
        } catch (error) {
          logger.error(error.message);
        }
      }
    }
  }

  async generateWallet(params) {
    const {
      belongsTo,
      symbol: asset,
    } = params;
    const foundAsset = await AssetModel.Model.findOne({
      _id: asset,
      active: true,
    });
    if (!foundAsset) throw new Error('Asset does not exist or is inactive');
    // if already exists, return
    const foundWallet = await this.findOne({
      belongsTo,
      asset: foundAsset.symbol,
    });
    if (foundWallet) {
      throw new Error(`Wallet already exists for ${belongsTo} and ${asset}`);
    }
    if (foundAsset.isCrypto) {
      return this.createCryptoWallet(params);
    }
    return this.create({
      belongsTo,
      isCrypto: foundAsset.isCrypto,
      asset: foundAsset.symbol,
      assetId: foundAsset._id,
    });
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

  async generateSystemWallets(params = {}) {
    const assets = await AssetModel.Model.find({
      active: true,
      isCrypto: false,
    });
    const symbols = assets.map((x) => x.symbol);
    const promises = assets.map((asset) => this.createFiatWallet({
      asset,
      belongsTo: params.customerId,
    }));
    const walletCreationData = await Promise.allSettled(promises);
    if (enableCryptoWallets) {
      await this.createCryptoWallets({
        belongsTo: params.customerId,
      });
    }
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
          true,
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
          true,
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

  async changeBalanceViaWalletId(
    walletId,
    customerId,
    side,
    amount,
    mFee = {},
    updateWallet = true,
  ) {
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
      // TODO: Handle the case when when amount needs to be deducted from wallet directly
      if (amount.isGreaterThan(newFrozen)) {
        throw new Error('Insufficient Balance');
      }
      newFrozen = newFrozen.minus(amount);
      paid = amount.minus(mFee);
      logger.info(`Withdraw ${amount} from ${customerId} Wallet (${found.asset}) (frozen balance), ${found._id}`);
    }
    if (updateWallet) {
      await this.updateById(walletId, {
        amount: newAmount.toString(),
        freezeAmount: newFrozen.toString(),
      });
    }
    return paid;
  }

  async refundBalance(walletId, customerId, amount) {
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
    const newFrozen = parseFloat(found.freezeAmount) - parseFloat(amount);
    const newAmount = parseFloat(found.amount) + parseFloat(amount);
    await this.updateById(found._id, {
      freezeAmount: newFrozen,
      amount: newAmount,
    });
    return amount;
  }

  async debitBalanceForInternalTransfer(params = {}) {
    const {
      walletId,
      customerId,
    } = params;
    if (!walletId) {
      throw new Error('Wallet Id is requried');
    }
    const amount = new BN(params.amount);
    const found = await this.findOne({
      _id: walletId,
      belongsTo: customerId,
    });
    if (!found) throw new Error('Wallet not found for customer');
    if (!found.active) throw new Error('This wallet is inactive');
    if (found.amount < amount) throw new Error('Insufficient Balance');
    logger.info(`Debited ${amount} from ${customerId} Wallet (${found.asset}), ${found._id}, Previous Balance: ${found.amount}`);
    return this.updateById(found._id, {
      amount: new BN(found.amount).minus(amount).toNumber(),
    });
  }

  async creditBalanceForDeposit(params = {}) {
    const {
      walletId,
      customerId,
    } = params;
    if (!walletId) {
      throw new Error('Wallet Id is requried');
    }
    const amount = new BN(params.amount);
    const found = await this.findOne({
      _id: walletId,
      belongsTo: customerId,
    });
    if (found.isCrypto) throw new Error('Crypto Wallets cannot be credited');
    if (!found) throw new Error('Wallet not found for customer');
    if (!found.active) throw new Error('This wallet is inactive');
    logger.info(`Deposited ${amount} to ${customerId} Wallet (${found.asset}), ${found._id}, Previous Balance: ${found.amount}`);
    return this.updateById(found._id, {
      amount: new BN(found.amount).plus(amount).toNumber(),
    });
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

  async revertFrozenAmountForWithdrawal(transaction) {
    const {
      frozenAmount,
      walletId,
      customerId,
      _id,
    } = transaction;
    const found = await this.findOne({
      _id: walletId._id,
      belongsTo: customerId,
    });
    if (!found) {
      throw new Error('Wallet not found for customer');
    }
    let newFrozenAmount = new BN(frozenAmount.toString());
    let newAmount = new BN(found.amount);
    const fee = 0.0;
    const deductibleAmount = new BN(fee);
    newFrozenAmount = newFrozenAmount.minus(deductibleAmount);
    newAmount = newAmount.plus(newFrozenAmount);
    const currentFrozenAmount = new BN(found.freezeAmount);
    if (currentFrozenAmount.isLessThan(newFrozenAmount)) {
      logger.info(
        `Wallet (${walletId._id}), does not have enough frozen balance, Current Frozen Balance: ${currentFrozenAmount.toString()}, Deducting Balance: ${newFrozenAmount.toString()}`
      );
      return found;
    }
    logger.info(`Previous Frozen Amount ${found.freezeAmount.toString()}`);
    logger.info(`Reverted Frozen Amount, ${newFrozenAmount.toString()} from ${customerId._id} Wallet (${walletId._id}), Symbol: ${walletId?.assetId?.symbol || '-'}, for failed withdrawal ${_id}`);
    logger.info(`Current Frozen Amount ${currentFrozenAmount.minus(newFrozenAmount).toString()}`);
    await this.updateById(found._id, {
      amount: newAmount.toString(),
      freezeAmount: currentFrozenAmount.minus(newFrozenAmount).toString(),
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

  async updateWalletFrozenAmount(params = {}) {
    let {
      walletId,
      amount,
      customerId,
      txId,
    } = params;
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
    // if (new BN(found.amount).isLessThan(amount)) {
    //   throw new Error('Insufficient Balance');
    // }
    let newFrozenAmount = new BN(found.freezeAmount);
    if (newFrozenAmount.isLessThan(amount)) {
      throw new Error('Insufficient Frozen Balance');
    }
    newFrozenAmount = newFrozenAmount.minus(amount);
    logger.info(`Removed From Frozen ${amount} from ${customerId} Wallet (${found.asset}), for transaction, ${txId.toString()}`);
    await this.updateById(found._id, {
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
        select: 'symbol image isCrypto token minAmount',
      }, {
        path: 'networks',
        select: 'address chainId',
        populate: [{
          path: 'chainId',
        }],
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

  async getWalletByCustomerId(customerId) {
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    return wallet;
  }

  async createIbWallet(params) {
    const {
      customerId,
      createdBy,
    } = params;
    ibWalletLogger.info(`Creating Ib Wallet for the ${customerId}`);
    const wallet = await this.Model.create({
      belongsTo: customerId,
      asset: 'IB',
      isCrypto: false,
      createdBy,
      ...params,
      isIb: true,
    });
    return wallet;
  }

  async addRebateToWallet(params) {
    const {
      customerId,
      amount,
      dealId,
    } = params;
    ibWalletLogger.info(`Adding Rebate for the ${customerId} amount: ${amount}`, ` dealId: ${dealId}`);
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const newAmount = BN(wallet.amount).plus(amount).toNumber();
    ibWalletLogger.info(`Added Rebate for the ${customerId} amount: ${amount} newAmount: ${newAmount}`, ` dealId: ${dealId}`);
    await this.updateById(wallet._id, {
      amount: newAmount,
    });
    return wallet;
  }

  async addCommissionToWallet(params) {
    const {
      customerId,
      amount,
      dealId,
    } = params;
    ibWalletLogger.info(`Adding Commission for the ${customerId} amount: ${amount}`, ` dealId: ${dealId}`);
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const newAmount = BN(wallet.amount).plus(amount).toNumber();
    ibWalletLogger.info(`Added Commission for the ${customerId} amount: ${amount} newAmount: ${newAmount}`, ` dealId: ${dealId}`);
    await this.updateById(wallet._id, {
      amount: newAmount,
    });
    return wallet;
  }

  async freezeAmount(params) {
    const {
      customerId,
      amount,
      currency,
    } = params;
    
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const conversionRate = await conversionRateService.getConversionRate({
      baseCurrency: currency,
      targetCurrency: wallet.currency,
    });
    const convertedAmt = parseFloat(conversionRate) * parseFloat(amount);
    const newAmount = BN(wallet.amount).minus(convertedAmt).toNumber();
    ibWalletLogger.info(`Freezing amount for the ${customerId} amount: ${amount} newAmount: ${newAmount}, freezeAmount: ${wallet.freezeAmount} convertedAmt: ${convertedAmt}`);
    if (convertedAmt > wallet.amount) {
      throw new Error(`Insufficient balance in the wallet for the customer: ${customerId}`);
    }
    const newWallet = await this.updateById(wallet._id, {
      amount: newAmount,
      freezeAmount: BN(wallet.freezeAmount).plus(convertedAmt).toNumber(),
    });
    return newWallet;
  }

  async unfreezeAmount(params) {
    const {
      customerId,
      amount,
      currency,
    } = params;
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const conversionRate = await conversionRateService.getConversionRate({
      baseCurrency: currency,
      targetCurrency: wallet.currency,
    });
    const convertedAmt = parseFloat(conversionRate) * parseFloat(amount);
    const newAmount = BN(wallet.amount).plus(convertedAmt).toNumber();
    ibWalletLogger.info(`Unfreezing amount for the ${customerId} amount: ${amount} newAmount: ${newAmount}, freezeAmount: ${wallet.freezeAmount} convertedAmt: ${convertedAmt}`);
    if (convertedAmt > wallet.freezeAmount) {
      throw new Error(`Insufficient balance in the wallet for the customer: ${customerId}`);
    }
    const newWallet = await this.updateById(wallet._id, {
      amount: newAmount,
      freezeAmount: BN(wallet.freezeAmount).minus(convertedAmt).toNumber(),
    });
    return newWallet;
  }

  async debit(params) {
    const {
      customerId,
      amount,
      currency,
    } = params;
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const conversionRate = await conversionRateService.getConversionRate({
      baseCurrency: currency,
      targetCurrency: wallet.currency,
    });
    const convertedAmt = parseFloat(conversionRate) * parseFloat(amount);
    const newAmount = BN(wallet.amount).minus(convertedAmt).toNumber();
    ibWalletLogger.info(`Debiting amount for the ${customerId} amount: ${amount} newAmount: ${newAmount}, freezeAmount: ${wallet.freezeAmount} convertedAmt: ${convertedAmt}`);
    if (convertedAmt > wallet.amount) {
      throw new Error(`Insufficient balance in the wallet for the customer: ${customerId}`);
    }
    const newWallet = await this.updateById(wallet._id, {
      amount: newAmount,
    });
    return newWallet;
  }

  async credit(params) {
    const {
      customerId,
      amount,
      currency,
    } = params;
    const wallet = await this.Model.findOne({
      belongsTo: customerId,
      isIb: true,
    });
    if (!wallet) {
      throw new Error(`Ib Wallet not found for this customer: ${customerId}`);
    }
    const conversionRate = await conversionRateService.getConversionRate({
      baseCurrency: currency,
      targetCurrency: wallet.currency,
    });
    const convertedAmt = parseFloat(conversionRate) * parseFloat(amount);
    const newAmount = BN(wallet.amount).plus(convertedAmt).toNumber();
    ibWalletLogger.info(`Crediting amount for the ${customerId} amount: ${amount} newAmount: ${newAmount}, freezeAmount: ${wallet.freezeAmount} convertedAmt: ${convertedAmt}`);
    const newWallet = await this.updateById(wallet._id, {
      amount: newAmount,
    });
    return newWallet;
  }
}

module.exports = new WalletService();

setTimeout(() => {
  // eslint-disable-next-line global-require
  const services = require('src/modules/services');
  chainService = services.chainService;
  addressService = services.addressService;
  addressTrackerService = services.addressTrackerService;
  cryptoAPIService = services.cryptoAPIService;
  conversionRateService = services.conversionRateService;
}, 0);
