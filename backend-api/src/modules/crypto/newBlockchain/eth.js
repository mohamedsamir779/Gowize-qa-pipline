const Web3 = require('web3');
const Wallet = require('ethereumjs-wallet');
const Websocket = require('ws');
const {
  CONSTANTS,
} = require('src/common/data');
const {
  logger,
} = require('src/common/lib');
const {
  sleep,
} = require('src/common/handlers');

const defaultAddressCallback = async (data) => {
  logger.info(`ETHChain: message Recieved ==> ${data}`);
};

const heartbeat = (ws, delay) => {
  logger.info(`ETHChain: opnened connection heartbeat ==> ${delay}`);
  ws.pingTimeout = setInterval(() => {
    ws.send(JSON.stringify({ event: 'ping' }));
  }, delay);
};

class ETHChain {
  constructor(options = {}) {
    this.LogTag = 'ETHChain';
    this.heartbeatTimeout = 20000;
    this.testnet = options.testnet || false;
    this.token = options.token || '9b6b2501-2c4b-4b93-a427-b719758a128d';
    this.websocketUrl = options.websocketUrl || `wss://socket.blockcypher.com/v1/eth/${this.testnet ? 'test3' : 'main'}?token=${this.token}`;
    if (!options.chainId) throw new Error(`${this.LogTag}: This requires a database id`);
    this.chainId = options.chainId;
    if (!options.defaultAddressCallback) logger.warn(`${this.LogTag}: You have not provided a default callback to the address listener`);
    this.defaultAddressCallback = options.defaultAddressCallback || defaultAddressCallback;
  }

  GenerateKeyPairs() {
    const EthWallet = Wallet.default.generate();
    return {
      address: EthWallet.getAddressString(),
      privateKey: EthWallet.getPrivateKeyString(),
      publicKey: EthWallet.getAddressString(),
    };
  }

  createConnection() {
    this.client = new Websocket(this.websocketUrl, {
      rejectUnauthorized: false,
    });
    const { client, heartbeatTimeout } = this;
    this.client.on('open', () => {
      heartbeat(client, heartbeatTimeout);
      // this.addressListener();
      // this.InitializeAddresses();
    });
  }
}

module.exports = ETHChain;
