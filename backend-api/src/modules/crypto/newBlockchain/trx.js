const TronWeb = require('tronweb');
const fullNode = 'https://api.shasta.trongrid.io';
const solidityNode = 'https://api.shasta.trongrid.io';
const eventServer = 'https://api.shasta.trongrid.io';
const tronwebMainAPIKey = 'd0b71613-db7f-4e56-97a1-9a54ba89361c';
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
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
  logger.info(`TRXChain: message Recieved ==> ${data}`);
};

class TRXChain {
  constructor(options = {}) {
    this.LogTag = 'TRXChain';
    this.heartbeatTimeout = 20000;
    this.testnet = options.testnet || false;
    this.token = options.token || '9b6b2501-2c4b-4b93-a427-b719758a128d';
    this.websocketUrl = options.websocketUrl || `wss://socket.blockcypher.com/v1/btc/${this.testnet ? 'test3' : 'main'}?token=${this.token}`;
    if (!options.chainId) throw new Error(`${this.LogTag}: This requires a database id`);
    this.chainId = options.chainId;
    if (!options.defaultAddressCallback) logger.warn(`${this.LogTag}: You have not provided a default callback to the address listener`);
    this.defaultAddressCallback = options.defaultAddressCallback || defaultAddressCallback;
  }

  async GenerateKeyPairs() {
    const ck = await tronWeb.createAccount();
    return {
      address: ck.address.hex,
      privateKey: ck.privateKey,
      publicKey: ck.publicKey,
    };
  }

  createConnection() {
    // this.client = new Websocket(this.websocketUrl, {
    //   rejectUnauthorized: false,
    // });
    // const { client, heartbeatTimeout } = this;
    // this.client.on('open', () => {
    //   heartbeat(client, heartbeatTimeout);
    //   this.addressListener();
    //   this.InitializeAddresses();
    // });
  }
}

module.exports = TRXChain;
