//
const {
  Cruds,
  SendEvent,
} = require('src/common/handlers');
const {
  CONSTANTS,
} = require('src/common/data');
const AddressModel = require('./address.model');

class AddressService extends Cruds {
  _constructor() {
    this.LogTag = 'AddressService';
    this.defaultPopulate = [{
      path: 'chainId',
      select: 'name symbol',
    }, {
      path: 'assetId',
      select: 'symbol name',
    }];
  }

  async addNewAddress(chainId = null, address = null, demo = false) {
    if (!chainId) {
      throw new Error(`${this.LogTag}: No chainId provided`);
    }
    if (!address) {
      throw new Error(`${this.LogTag}: No address provided`);
    }
    let currentAddresses;
    if (chainId) {
      currentAddresses = await this.findOneWithPopulate({ chainId }, this.defaultPopulate);
    } else {
      throw new Error(`${this.LogTag}: Could not find chain/symbol to add address to`);
    }
    const find = currentAddresses.address && currentAddresses.address.find((x) => x === address);
    if (find) throw new Error(`${this.LogTag}: Address (${address}) already exists in chain (${currentAddresses.chainId.symbol} | ${chainId})`);
    // add chain address validator here
    SendEvent(CONSTANTS.EVENT_TYPES.EVENT_CHAIN_ADDRESS_CREATED, null, {
      ...currentAddresses.chainId,
      addressAdded: address,
    }, demo);
    return this.updateById(currentAddresses._id, {}, {
      push: {
        address,
      },
    });
  }
}

module.exports = new AddressService(AddressModel.Model, AddressModel.Schema);
