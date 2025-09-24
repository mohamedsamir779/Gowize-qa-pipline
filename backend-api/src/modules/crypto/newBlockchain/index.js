const {
  sleep,
} = require('src/common/handlers');
const {
  keys,
} = require('src/common/data');
const BTCChain = require('./btc');
const ETHChain = require('./eth');
// const XRPChain = require('./xrp');
// const SOLChain = require('./sol');
const DOGEChain = require('./doge');
const TRXChain = require('./trx');
const LTCChain = require('./ltc');
// const XMRChain = require('./xmr');
// const BCHChain = require('./bch');
const DASHChain = require('./dash');
// const BNBChain = require('./bnb');

let chainService;

let BlockchainConnection = null;

const getChainClass = (name, opt) => {
  const n = name.toLowerCase();
  const { chainId, ...rest } = opt;
  let ch;
  const classOptions = {
    chainId,
    ...rest,
  };
  // eslint-disable-next-line default-case
  switch (n) {
    case 'btc':
    case 'bitcoin':
      ch = new BTCChain(classOptions);
      ch.createConnection();
      return {
        name: 'bitcoin',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    case 'eth':
    case 'ethereum':
      ch = new ETHChain(classOptions);
      ch.createConnection();
      return {
        name: 'ethereum',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    // case 'xrp':
    // case 'ripple': return {
    //   name: 'ripple',
    //   class: new XRPChain(),
    //   options: rest,
    //   chainId,
    // };
    // case 'sol':
    // case 'solana': return {
    //   name: 'solana',
    //   class: new SOLChain(),
    //   options: rest,
    //   chainId,
    // };
    case 'doge':
    case 'dogecoin':
    case 'doge coin':
      ch = new DOGEChain(classOptions);
      ch.createConnection();
      return {
        name: 'doge coin',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    case 'trx':
    case 'tron':
      ch = new TRXChain(classOptions);
      ch.createConnection();
      return {
        name: 'tron',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    case 'ltc':
    case 'litecoin':
    case 'lite coin':
      ch = new LTCChain(classOptions);
      ch.createConnection();
      return {
        name: 'lite coin',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    // case 'xmr':
    // case 'monero': return {
    //   name: 'monero',
    //   class: new XMRChain(),
    //   options: rest,
    //   chainId,
    // };
    // case 'bch':
    // case 'bitcoin cash': return {
    //   name: 'bitcoin cash',
    //   class: new BCHChain(),
    //   options: rest,
    //   chainId,
    // };
    case 'dash':
    case 'dashcoin':
    case 'dash coin':
      ch = new DASHChain(classOptions);
      ch.createConnection();
      return {
        name: 'dash coin',
        class: ch,
        options: rest,
        chainId,
        token: keys.blockcypherApiKey,
      };
    // case 'bnb':
    // case 'binance coin': return {
    //   name: 'binance coin',
    //   class: new BNBChain(),
    //   options: rest,
    //   chainId,
    // };
  }
  throw new Error(`This ${name} is not yet supported`);
};

const getChainConnection = (connectionList, name) => {
  // const n = name.toLowerCase();
  // let findName;
  // // eslint-disable-next-line default-case
  // switch (n) {
  //   case 'btc':
  //   case 'bitcoin':
  //     findName = 'bitcoin';
  //     break;
  //   // case 'eth':
  //   // case 'ethereum':
  //   //   findName = 'ethereum';
  //   //   break;
  //   // case 'xrp':
  //   // case 'ripple':
  //   //   findName = 'ripple';
  //   //   break;
  //   // case 'sol':
  //   // case 'solana':
  //   //   findName = 'solana';
  //   //   break;
  //   case 'doge':
  //   case 'doge coin':
  //     findName = 'doge coin';
  //     break;
  //   // case 'trx':
  //   // case 'tron':
  //   //   findName = 'tron';
  //   //   break;
  //   case 'ltc':
  //   case 'lite coin':
  //     findName = 'lite coin';
  //     break;
  //   // case 'xmr':
  //   // case 'monero':
  //   //   findName = 'monero';
  //   //   break;
  //   // case 'bch':
  //   // case 'bitcoin cash':
  //   //   findName = 'bitcoin cash';
  //   //   break;
  //   case 'dash':
  //   case 'dash coin':
  //     findName = 'dash coin';
  //     break;
  //   // case 'bnb':
  //   // case 'binance coin':
  //   //   findName = 'binance coin';
  //   //   break;
  // }
  // if (!findName) throw new Error(`This ${name} not yet supported/Added`);
  const find = connectionList.find((x) => x.chainId.toString() === name.toString());
  if (!find) throw new Error(`This ${name} is not found in the connections`);
  return find.class;
};

class Blockchain {
  constructor() {
    this.ChainConnections = [];
  }

  async connectAllChains() {
    const chains = await chainService.find({ active: true });
    const allConns = [];
    for (let i = 0; i < chains.length; i++) {
      await sleep(20000);
      const currentChain = chains[i];
      const currentConn = getChainClass(
        currentChain.name, {
          chainId: currentChain._id.toString(),
          ...currentChain,
        },
      );
      allConns.push(currentConn);
    }
    this.ChainConnections = allConns;
  }

  static init() {
    if (!BlockchainConnection) {
      BlockchainConnection = new Blockchain();
      BlockchainConnection.connectAllChains();
    }
  }

  static getConnection() {
    if (!BlockchainConnection) {
      throw new Error('no active connection');
    }
    return BlockchainConnection;
  }

  static getSpecificConnection(chainId) {
    if (!BlockchainConnection) {
      throw new Error('no active connection');
    }
    return getChainConnection(BlockchainConnection.ChainConnections, chainId);
  }
}

module.exports = {
  GetChainConnection: Blockchain.getSpecificConnection,
  GetConnection: Blockchain.getConnection,
  Initialize: Blockchain.init,
};

setTimeout(() => {
  // eslint-disable-next-line global-require
  const services = require('src/modules/services');
  chainService = services.chainService;
}, 0);
