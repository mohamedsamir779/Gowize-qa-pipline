/* eslint-disable max-len */
// const {
//   Currency,
//   createAccount,
//   generateWallet,
//   generateAddressFromXPub,
//   generatePrivateKeyFromMnemonic,
//   assignDepositAddress,
//   SubscriptionType,
//   createNewSubscription,
//   generateDepositAddress,
// } = require('@tatumio/tatum');
const { logger } = require('src/common/lib');
const { keys } = require('src/common/data');

const baseWalletEndpoint = `${keys.crmURL}/wallets/`;

const selectAsset = (id) => {
  // if (!Currency[id]) throw new Error(`This ${id} cannot be implemented`);
  id = id.toLowerCase();
  // eslint-disable-next-line default-case
  switch (id) {
    // case 'btc':
    // case 'bitcoin': return Currency.BTC;
    // case 'eth':
    // case 'ethereum': return Currency.ETH;
    // case 'usdt':
    // case 'tether': return Currency.USDT;
    // case 'doge':
    // case 'dogecoin': return Currency.DOGE;
    // case 'ada':
    // case 'cardano': return Currency.ADA;
    // case 'link':
    // case 'chainlink': return Currency.LINK;
    // case 'trx':
    // case 'tron': return Currency.TRON;
    // case 'dot':
    // case 'polkadot': return Currency.BDOT;
    // case 'uni':
    // case 'uniswap': return Currency.UNI;
    // not supported in this library
    // case 'bch':
    // case 'bitcoin cash': return Currency.BCH;
    // case 'etc':
    // case 'etherum classic': return Currency.ETC;
    // case 'xmr':
    // case 'monero': return Currency.XMR;
    // case 'ltc':
    // case 'litecoin': return Currency.LTC;
    // case 'sol':
    // case 'solana': return Currency.SOL;
    // case 'BNB':
    case 'binance coin': return 'BNB';
  }
  throw new Error(`This ${id} is not yet supported`);
};

class BlockChain {
  constructor(id, testnet = true) {
    this.id = selectAsset(id);
    this.testnet = testnet;
  }

  generateWebhookUrlForTatum(id, type) {
    // eslint-disable-next-line default-case, no-empty
    switch (type) {
      // case SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION: return `${baseWalletEndpoint}${id}/blockchain/incoming`;
      // case SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION: return `${baseWalletEndpoint}${id}/blockchain/pending`;
      // case SubscriptionType.TRANSACTION_IN_THE_BLOCK: return `${baseWalletEndpoint}${id}/blockchain/transaction`;
      // case SubscriptionType.OFFCHAIN_WITHDRAWAL: return `${baseWalletEndpoint}${id}/blockchain/offchain-withdrawal`;
      // case SubscriptionType.KMS_COMPLETED_TX: return `${baseWalletEndpoint}${id}/kms/completed`;
      // case SubscriptionType.KMS_FAILED_TX: return `${baseWalletEndpoint}${id}/kms/failed`;
    }
    return `${baseWalletEndpoint}${id}/blockchain`;
  }

  async generateWallet(mnemonicCode = undefined) {
    const {
      mnemonic,
      xpub,
    } = {}; // await generateWallet(this.id, this.testnet, mnemonicCode);
    const createAccountData = {
      currency: this.id,
      xpub,
    };
    console.log('testing', this.id, xpub);
    const virtualAccount = {}; // await createAccount(createAccountData);
    const {
      derivationKey,
      address: publicKey,
    } = {}; // await generateDepositAddress(virtualAccount.id);
    const privateKey = {};
    // await generatePrivateKeyFromMnemonic(
    //   this.id,
    //   this.testnet,
    //   mnemonic,
    //   derivationKey,
    // );
    // const test = await assignDepositAddress(virtualAccount.id, publicKey);
    this.subscribeToAllWalletUpdates(virtualAccount.id);
    return {
      xpub,
      mnemonic,
      publicKey,
      privateKey,
      tatumVirtualId: virtualAccount.id,
      derivationKey,
    };
  }

  async subcribeToTatumWalletUpdates(
    type = '',
    id,
  ) {
    if (!id) throw new Error('Tatum id is required for subcribing to updates');
    const url = this.generateWebhookUrlForTatum(id, type);
    console.log(url);
    const data = {
      type,
      attr: {
        id,
        url,
      },
    };
    return {}; // createNewSubscription(data);
  }

  async subscribeToAllWalletUpdates(id) {
    const types = [
      // SubscriptionType.ACCOUNT_INCOMING_BLOCKCHAIN_TRANSACTION,
      // SubscriptionType.ACCOUNT_PENDING_BLOCKCHAIN_TRANSACTION,
      // SubscriptionType.TRANSACTION_IN_THE_BLOCK,
      // SubscriptionType.OFFCHAIN_WITHDRAWAL,
      // SubscriptionType.KMS_COMPLETED_TX,
      // SubscriptionType.KMS_FAILED_TX,
    ];
    const promises = types.map((type) => this.subcribeToTatumWalletUpdates(type, id));
    const subcribeData = await Promise.allSettled(promises);
    return subcribeData.forEach((data, index) => {
      let message = '';
      if (data.status === 'rejected') {
        console.log(data);
        message = `Subcription to (${types[index]}) failed due to ${data.reason.message}`;
      } else {
        message = `Subcription to (${types[index]}) was successful, id: ${id}`;
      }
      logger.info(message);
    });
  }
}

module.exports = BlockChain;
