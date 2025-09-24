const mongoose = require('mongoose');
const Cryptoapis = require('cryptoapis');
const {
  walletService,
  transactionService,
  addressService,
} = require('src/modules/services');
const keys = require('../../../common/data/keys');

const allowedChains = ['bitcoin', 'bitcoin-cash', 'litecoin', 'dogecoin', 'dash', 'ethereum', 'ethereum-classic', 'xrp', 'binance-smart-chain', 'zcash', 'tron'];
const tokenChains = ['ethereum', 'ethereum-classic', 'binance-smart-chain'];
const utxoChains = ['bitcoin', 'bitcoin-cash', 'litecoin', 'dogecoin', 'dash', 'zcash'];
const trxChain = ['tron'];
const xrpChain = ['xrp'];

const getWithdrawalURL = (walletId, blockchain, network, fromAddress, isToken = false) => {
  let url = '';
  if (!blockchain) {
    throw new Error('Blockchain is required');
  }
  // eslint-disable-next-line default-case
  switch (blockchain) {
    case 'bitcoin':
    case 'bitcoin-cash':
    case 'litecoin':
    case 'dogecoin':
    case 'dash':
    case 'zcash':
      url = `/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/transaction-requests`;
      break;
    case 'ethereum':
    case 'ethereum-classic':
    case 'binance-smart-chain':
    case 'xrp':
      url = isToken
        ? `/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/addresses/${fromAddress}/token-transaction-requests`
        : `/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/addresses/${fromAddress}/transaction-requests`;
      break;
    case 'tron':
      url = isToken
        ? `/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/addresses/${fromAddress}/feeless-token-transaction-requests`
        : `/wallet-as-a-service/wallets/${walletId}/${blockchain}/${network}/addresses/${fromAddress}/feeless-transaction-requests`;
      break;
  }
  return url;
};
class CryptoAPIService {
  constructor(testnet = false) {
    this.network = testnet ? 'testnet' : 'mainnet';
    this.defaultClient = Cryptoapis.ApiClient.instance;
    this.ApiKey = this.defaultClient.authentications.ApiKey;
    this.ApiKey.apiKey = keys.cryptoAPI.apiKey;
    this.generatingApis = new Cryptoapis.GeneratingApi();
    this.assetApis = new Cryptoapis.AssetsApi();
    this.subscriptionApis = new Cryptoapis.CreateSubscriptionsForApi();
    this.transactionApis = new Cryptoapis.TransactionsApi();
    this.manageSubsApis = new Cryptoapis.ManageSubscriptionsApi();
  }

  async createMasterWallet(context = '') {
    const opts = {
      context,
      createNewMasterWalletRB: new Cryptoapis.CreateNewMasterWalletRB(),
    };
    this.generatingApis.createNewMasterWallet(opts).then((data) => {
      console.log(`API called successfully. Returned data: ${data}`);
      return data;
    }, (error) => {
      console.error(error);
    });
  }

  async createDepositAddress(blockchain = 'bitcoin', network = this.network, walletId = '643e4d384dd5e90007b42588', context = 'xxx') {
    if (!allowedChains.includes(blockchain.toLowerCase())) {
      return {
        error: new Error('Invalid blockchain'),
      };
    }
    const opts = {
      context,
      generateDepositAddressRB: new Cryptoapis.GenerateDepositAddressRB(
        new Cryptoapis.GenerateDepositAddressRBData(
          new Cryptoapis.GenerateDepositAddressRBDataItem.constructFromObject({
            label: 'testxxx',
          }),
        ),
      ),
    };
    try {
      const data = await this.generatingApis.generateDepositAddress(
        blockchain,
        network,
        walletId,
        opts,
      );
      console.log('API called successfully. Returned data: ', data);
      return { data };
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  async createSubscriptionForAddress(blockchain = 'bitcoin', network = this.network, address, context = '') {
    if (!allowedChains.includes(blockchain.toLowerCase())) {
      return {
        error: new Error('Invalid blockchain'),
      };
    }
    if (!address) {
      return {
        error: new Error('Invalid address'),
      };
    }
    const opts = {
      context,
      newConfirmedCoinsTransactionsAndEachConfirmationRB:
        new Cryptoapis.NewConfirmedCoinsTransactionsAndEachConfirmationRB(
          new Cryptoapis.NewConfirmedCoinsTransactionsAndEachConfirmationRBData(
            new Cryptoapis.NewConfirmedCoinsTransactionsAndEachConfirmationRBDataItem.constructFromObject({
              address,
              allowDuplicates: false,
              callbackSecretKey: keys.cryptoAPI.callbackSecret,
              callbackUrl: `${keys.cryptoAPI.callbackBaseUrl}/deposit-callback`,
              confirmationsCount: 3,
            }),
          ),
        ),
    };
    try {
      const data = await this.subscriptionApis.newConfirmedCoinsTransactionsAndEachConfirmation(
        blockchain,
        network,
        opts,
      );
      console.log('API called successfully. Returned data: ', data);
      return {
        data,
      };
    } catch (error) {
      console.log(`Could not add subcription for address: ${address} at ${blockchain} and ${network}`);
      console.error(error);
      return {
        error,
      };
    }
  }

  async makeCoinWithdrawal(
    blockchain = 'bitcoin',
    network = this.network,
    walletId = '643e4d384dd5e90007b42588',
    fromAddress,
    toAddress,
    amount,
    feePriority = 'standard',
    callbackUrl = '',
    note = '',
    context = '',
  ) {
    try {
      let opts;
      let data;
      // eslint-disable-next-line default-case
      switch (blockchain) {
        case 'bitcoin':
        case 'bitcoin-cash':
        case 'litecoin':
        case 'dogecoin':
        case 'dash':
        case 'zcash':
          opts = {
            context,
            createCoinsTransactionRequestFromWalletRB:
              new Cryptoapis.CreateCoinsTransactionRequestFromWalletRB(
                new Cryptoapis.CreateCoinsTransactionRequestFromWalletRBData(
                  new Cryptoapis.CreateCoinsTransactionRequestFromWalletRBDataItem.constructFromObject({
                    callbackUrl,
                    callbackSecretKey: keys.cryptoAPI.callbackSecret,
                    feePriority,
                    note,
                    prepareStrategy: 'minimize-dust',
                    recipients: [{
                      address: toAddress,
                      amount,
                    }],
                  }),
                ),
              ),
          };
          data = await this.transactionApis.createCoinsTransactionRequestFromWallet(
            blockchain,
            network,
            walletId,
            opts,
          );
          break;
        case 'ethereum':
        case 'ethereum-classic':
        case 'binance-smart-chain':
        case 'xrp':
          opts = {
            context,
            createCoinsTransactionRequestFromAddressRB:
              new Cryptoapis.CreateCoinsTransactionRequestFromAddressRB(
                new Cryptoapis.CreateCoinsTransactionRequestFromAddressRBData(
                  new Cryptoapis.CreateCoinsTransactionRequestFromAddressRBDataItem.constructFromObject({
                    amount,
                    callbackUrl,
                    callbackSecretKey: keys.cryptoAPI.callbackSecret,
                    feePriority,
                    note,
                    recipientAddress: toAddress,
                  }),
                ),
              ),
          };
          data = await this.transactionApis.createCoinsTransactionRequestFromAddress(
            fromAddress,
            blockchain,
            network,
            walletId,
            opts,
          );
          break;
        case 'tron':
          opts = {
            context,
            createSingleTransactionRequestFromAddressWithoutFeePriorityRB:
              new Cryptoapis.CreateSingleTransactionRequestFromAddressWithoutFeePriorityRB(
                new Cryptoapis.CreateSingleTransactionRequestFromAddressWithoutFeePriorityRBData(
                  new Cryptoapis.CreateSingleTransactionRequestFromAddressWithoutFeePriorityRBDataItem.constructFromObject({
                    amount,
                    callbackUrl,
                    callbackSecretKey: keys.cryptoAPI.callbackSecret,
                    note,
                    recipientAddress: toAddress,
                  }),
                ),
              ),
          };
          data = await this.transactionApis.createSingleTransactionRequestFromAddressWithoutFeePriority(
            fromAddress,
            blockchain,
            network,
            walletId,
            opts,
          );
          break;
      }
      return {
        data,
      };
    } catch (error) {
      // TODO: Makue sure to reject the transaction and refund the amount to his wallet
      console.log(error);
      return {
        error,
      };
    }
  }

  async makeTokenWithdrawal(
    blockchain = 'ethereum',
    network = this.network,
    tokenAddress,
    walletId = '643e4d384dd5e90007b42588',
    fromAddress,
    toAddress,
    amount,
    feePriority = 'medium',
    callbackUrl,
    note = '',
    context = '',
  ) {
    try {
      let opts;
      let data;
      // eslint-disable-next-line default-case
      switch (blockchain) {
        case 'ethereum':
        case 'ethereum-classic':
        case 'binance-smart-chain':
          opts = {
            context,
            createFungibleTokensTransactionRequestFromAddressRB:
              new Cryptoapis.CreateFungibleTokensTransactionRequestFromAddressRB(
                new Cryptoapis.CreateFungibleTokensTransactionRequestFromAddressRBData(
                  new Cryptoapis.CreateFungibleTokensTransactionRequestFromAddressRBDataItem.constructFromObject({
                    amount,
                    callbackUrl,
                    callbackSecretKey: keys.cryptoAPI.callbackSecret,
                    feePriority,
                    note,
                    recipientAddress: toAddress,
                    tokenIdentifier: tokenAddress,
                  }),
                ),
              ),
          };
          data = await this.transactionApis.createFungibleTokensTransactionRequestFromAddress(
            blockchain,
            network,
            fromAddress,
            walletId,
            opts,
          );
          break;
        case 'tron':
          opts = {
            context,
            createFungibleTokenTransactionRequestFromAddressWithoutFeePriorityRB:
              new Cryptoapis.CreateFungibleTokenTransactionRequestFromAddressWithoutFeePriorityRB(
                new Cryptoapis.CreateFungibleTokenTransactionRequestFromAddressWithoutFeePriorityRBData(
                  new Cryptoapis.CreateFungibleTokenTransactionRequestFromAddressWithoutFeePriorityRBDataItem.constructFromObject({
                    amount,
                    callbackUrl,
                    callbackSecretKey: keys.cryptoAPI.callbackSecret,
                    // feeLimit: '', //optional
                    feePriority,
                    note,
                    recipientAddress: toAddress,
                    tokenIdentifier: tokenAddress,
                  }),
                ),
              ),
          };
          data = await this.transactionApis.createFungibleTokenTransactionRequestFromAddressWithoutFeePriority(
            blockchain,
            network,
            fromAddress,
            walletId,
            opts,
          );
          break;
      }
      return {
        data,
      };
    } catch (error) {
      console.log(error);
      return {
        error,
      };
    }
  }

  async createSubscriptionForToken(blockchain = 'bitcoin', network = this.network, address, context = '') {
    if (!allowedChains.includes(blockchain.toLowerCase())) {
      return {
        error: new Error('Invalid blockchain'),
      };
    }
    if (!address) {
      return {
        error: new Error('Invalid address'),
      };
    }
    const opts = {
      context,
      newConfirmedTokensTransactionsAndEachConfirmationRB:
        new Cryptoapis.NewConfirmedTokensTransactionsAndEachConfirmationRB(
          new Cryptoapis.NewConfirmedTokensTransactionsAndEachConfirmationRBData(
            new Cryptoapis.NewConfirmedTokensTransactionsAndEachConfirmationRBDataItem.constructFromObject({
              address,
              allowDuplicates: false,
              callbackSecretKey: keys.cryptoAPI.callbackSecret,
              callbackUrl: `${keys.cryptoAPI.callbackBaseUrl}/deposit-callback/token`,
              confirmationsCount: 6,
            }),
          ),
        ),
    };
    try {
      const data = await this.subscriptionApis.newConfirmedTokensTransactionsAndEachConfirmation(
        blockchain,
        network,
        opts,
      );
      console.log('API called successfully. Returned data: ', data);
      return {
        data,
      };
    } catch (error) {
      console.log(`Could not add subcription for address: ${address} at ${blockchain} and ${network}`);
      console.error(error);
      return {
        error,
      };
    }
  }

  async depositCallback(params = {}) {
    try {
      // const x = {
      //   "apiVersion": "2021-03-20",
      //   "referenceId": "6038d09050653d1f0e40584c",
      //   "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
      //   "data": {
      //     "product": "BLOCKCHAIN_EVENTS",
      //     "event": "ADDRESS_COINS_TRANSACTION_CONFIRMED_EACH_CONFIRMATION",
      //     "item": {
      //       "blockchain": "bitcoin",
      //       "network": "testnet",
      //       "address": "15282N4BYEwYh3j1dTgJu64Ey5qWn9Po9F",
      //       "minedInBlock": {
      //         "height": 667754,
      //         "hash": "dfe45f6724b550c281107ffaa5880cb280878fb4dbaa742aa21449f3d2340c13",
      //         "timestamp": 1610365314,
      //       },
      //       "transactionId": "cbd3dea703bd2bc78bca69ee61ca14e6ffcdd809d07ebbc3b8fea3c30ea38f33",
      //       "currentConfirmations": 18,
      //       "targetConfirmations": 12,
      //       "amount": "0.0611",
      //       "unit": "BTC",
      //       "direction": "incoming",
      //     },
      //   },
      // };
      console.log(params);
      console.log(JSON.stringify(params));
      if (params && params.data && params.data.item) {
        const addressRef = await addressService.findOne({
          address: params.data.item.address,
        });
        if (!addressRef) {
          console.log("Address doesn't exist in the database", params.data.item.address);
          return;
        }
        const wallet = await walletService.findOne({
          asset: params.data.item.unit,
          networks: mongoose.Types.ObjectId(addressRef._id),
        });
        const txData = {
          txId: params.data.item.transactionId,
          amount: parseFloat(params.data.item.amount),
          fee: params.data.item.fee ? parseFloat(params.data.item.fee) : 0,
          gateway: 'BLOCKCHAIN',
          walletId: wallet._id,
          walletModel: 'wallet',
          rawData: params,
          direction: params.data.item.direction,
          currentConfirmations: params.data.item.currentConfirmations,
          targetConfirmations: params.data.item.targetConfirmations,
          customerId: wallet.belongsTo,
          currency: params.data.item.unit,
          requestId: params.requestId,
        };
        if (params.data.item.direction === 'incoming') {
          await transactionService.addUpdateBlockchainDepositNew(txData);
        }
        if (params.data.item.direction === 'outgoing') {
          await transactionService.addUpdateBlockchainWithdrawNew(txData);
        }
      } else {
        console.log('DEPOSIT CALLBACK: Invalid data');
      }
    } catch (error) {
      console.log(`Error in depositCallback: ${error}`);
      console.error(error);
    }
  }

  async deleteSubscription(params = {}) {
    try {
      const addressDetails = await addressService.findOne({
        subscriptionReference: params.subscriptionId,
      }, {}, {
        populate: [{
          path: 'chainId',
          select: 'cryptoapiName name hasTokens address blockchain',
        }],
      });
      if (!addressDetails) {
        throw new Error('Subscription not found');
      }
      const opts = {
        context: '',
      };
      const data = await this.manageSubsApis.deleteBlockchainEventSubscription(
        addressDetails.chainId.cryptoapiName,
        'goerli',
        params.subscriptionId,
        opts,
      );
      await addressService.updateById(addressDetails._id, {
        subscriptionReference: null,
      }, {}, {
        populate: [{
          path: 'chainId',
          select: 'cryptoapiName name hasTokens address blockchain',
        }],
      });
      return {
        data,
      };
    } catch (error) {
      console.log(`Error in delete subscription: ${error}`);
      console.error(error);
      return {
        error: error.message,
      };
    }
  }

  async withdrawCallback(params = {}) {
    const {
      blockchain,
      network,
      fromAddress,
      transactionId,
    } = params;
    const transaction = await transactionService.findById(
      transactionId,
      {},
      true,
      transactionService.defaultPopulate,
    );
    console.log('Withdrawal Callback Data', params)
    //btc

    //resonse of transcrtion
    // {
    //   "apiVersion": "2023-04-25",
    //     "requestId": "601c1710034ed6d407996b30",
    //       "context": "yourExampleString",
    //         "data": {
    //     "item": {
    //       "callbackSecretKey": "yourSecretKey",
    //         "callbackUrl": "https://example.com",
    //           "feePriority": "standard",
    //             "note": "yourAdditionalInformationhere",
    //               "recipients": [
    //                 {
    //                   "address": "mmd963W1fECjLyaDCHcioSCZYHkRwjkhtr",
    //                   "amount": "0.00123"
    //                 }
    //               ],
    //                 "totalTransactionAmount": "0.001",
    //                   "transactionRequestId": "6017dd02a309213863be9e55",
    //                     "transactionRequestStatus": "created"
    //     }
    //   }
    // }
    //callback response
    // {
    //   "apiVersion": "2021-03-20",
    //     "referenceId": "6038d09050653d1f0e40584c",
    //       "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
    //         "data": {
    //     "product": "WALLET_AS_A_SERVICE",
    //       "event": "TRANSACTION_REQUEST_APPROVAL",
    //         "item": {
    //       "blockchain": "Bitcoin\/Ethereum (whichever applicable)",
    //         "network": "Testnet\/Mainnet (whichever applicable)",
    //           "requiredApprovals": 2,
    //             "requiredRejections": 2,
    //               "currentApprovals": 1,
    //                 "currentRejections": 0
    //     }
    //   }
    // }
    //eth
    // {
    //   "apiVersion": "2021-03-20",
    //     "referenceId": "6038d09050653d1f0e40584c",
    //       "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
    //         "data": {
    //     "product": "WALLET_AS_A_SERVICE",
    //       "event": "TRANSACTION_REQUEST_APPROVAL",
    //         "item": {
    //       "blockchain": "Bitcoin\/Ethereum (whichever applicable)",
    //         "network": "Testnet\/Mainnet (whichever applicable)",
    //           "requiredApprovals": 2,
    //             "requiredRejections": 2,
    //               "currentApprovals": 1,
    //                 "currentRejections": 0
    //     }
    //   }
    // }
    //tron
    // {
    //   "apiVersion": "2021-03-20",
    //     "referenceId": "6038d09050653d1f0e40584c",
    //       "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
    //         "data": {
    //     "product": "WALLET_AS_A_SERVICE",
    //       "event": "TRANSACTION_REQUEST_APPROVAL",
    //         "item": {
    //       "blockchain": "Bitcoin\/Ethereum (whichever applicable)",
    //         "network": "Testnet\/Mainnet (whichever applicable)",
    //           "requiredApprovals": 2,
    //             "requiredRejections": 2,
    //               "currentApprovals": 1,
    //                 "currentRejections": 0
    //     }
    //   }
    // }
    if (params && params.data && params.data.event) {
      // eslint-disable-next-line default-case
      switch (params.data.event) {
        case 'TRANSACTION_REQUEST_BROADCASTED':
        case 'TRANSACTION_REQUEST_MINED': 
          if (params.data.item) {
            transactionService.updateById(transaction._id, {
              txId: params.data.item.transactionId,
              withdrawCallbackReferenceId: params.referenceId,
            });
          }
          break;
        case 'TRANSACTION_REQUEST_APPROVAL':
          if (params.data.item) {
            transactionService.updateById(transaction._id, {
              cryptoAPIConfirmations: params.data.item.currentApprovals,
              withdrawCallbackReferenceId: params.referenceId,
            });
          }
          break;
        case 'TRANSACTION_REQUEST_REJECTION':
          if (params.data.item) {
            const walletResp = await walletService.revertFrozenAmountForWithdrawal(transaction);
            transactionService.updateById(transaction._id, {
              status: 'REJECTED',
              withdrawCallbackReferenceId: params.referenceId,
              cryptoAPIRejections: params.data.item.currentRejections,
              reason: params.data.item.errorMessage || 'Error - Rejected via CryptoAPI',
            });
          }
          break;
        case 'TRANSACTION_REQUEST_FAIL':
          if (params.data.item) {
            const walletResp = await walletService.revertFrozenAmountForWithdrawal(transaction);
            transactionService.updateById(transaction._id, {
              status: 'REJECTED',
              withdrawCallbackReferenceId: params.referenceId,
              cryptoAPIRejections: params.data.item.currentRejections,
              reason: params.data.item.errorMessage || 'Error - Failed via CryptoAPI',
            });
          }
          break;
      }
    } else {
      console.error(`No event found for transaction response ${transaction._id}`);
    }
    return {
      // data,
    };
  }

  async depositCallbackToken(params = {}) {
    try {
      const sx = {
        "apiVersion": "2021-03-20",
        "referenceId": "6038d09050653d1f0e40584c",
        "idempotencyKey": "e55bf7a4a7188855f1c27541a6c387d04cc3b22ee34d1304b0e6ecad61c9906c",
        "data": {
          "product": "BLOCKCHAIN_EVENTS",
          "event": "ADDRESS_TOKENS_TRANSACTION_CONFIRMED_EACH_CONFIRMATION",
          "item": {
            "blockchain": "ethereum",
            "network": "ropsten",
            "address": "0x7495fede000c8a3b77eeae09cf70fa94cd2d53f5",
            "minedInBlock": {
              "height": 657915,
              "hash": "269b0de44db95beddb6aecc520b375ba8f91f3dc5558a24aa4c26979eb00c7e2",
              "timestamp": 1586365500
            },
            "transactionId": "0xbe38781783b1b9d480219255ff98e20335a39e13979a66112efa33f05fde0a33",
            "currentConfirmations": 2,
            "targetConfirmations": 3,
            "tokenType": "ERC-20",
            "token": {
              "name": "Tether USD",
              "symbol": "USDT",
              "decimals": "6",
              "amount": "11.9",
              "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7"
            },
            "direction": "incoming"
          }
        }
      }
      console.log(params);
      console.log(JSON.stringify(params));
      if (params && params.data && params.data.item) {
        const addressRef = await addressService.findOne({
          address: params.data.item.address,
        });
        if (!addressRef) {
          console.log("Address doesn't exist in the database", params.data.item.address);
          return;
        }
        if (params?.data?.item?.token?.symbol) {
          const wallet = await walletService.findOne({
            asset: params?.data?.item?.token?.symbol,
            networks: mongoose.Types.ObjectId(addressRef._id),
          });
          const txData = {
            txId: params.data.item.transactionId,
            amount: parseFloat(params.data.item.token.amount),
            gateway: 'BLOCKCHAIN',
            walletId: wallet._id,
            walletModel: 'wallet',
            rawData: params,
            direction: params.data.item.direction,
            currentConfirmations: params.data.item.currentConfirmations,
            targetConfirmations: params.data.item.targetConfirmations,
            customerId: wallet.belongsTo,
            currency: params.data.item.token.symbol,
            referenceId: params.referenceId
          };
          if (params.data.item.direction === 'incoming') {
            await transactionService.addUpdateBlockchainDepositNew(txData);
          }
          if (params.data.item.direction === 'outgoing') {
            await transactionService.addUpdateBlockchainWithdrawNew(txData);
          }
        } else {
          console.log(`Symbol not present in the deposit callback, please approve manually, ${params.data}`);
        }
      } else {
        console.log('DEPOSIT CALLBACK: Invalid data');
      }
    } catch (error) {
      console.log(`Error in depositCallback: ${error}`);
      console.error(error);
    }
  }
}

module.exports = new CryptoAPIService(true);
