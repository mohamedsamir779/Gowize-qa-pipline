//
const {
  Cruds,
  logger,
  SendEvent,
} = require('src/common/handlers');
const {
  CONSTANTS,
} = require('src/common/data');
const AddressTrackerModel = require('./addresstracker.model');

class AddressTrackerService extends Cruds {
  _constructor() {
    this.baseErrorMessage = 'Chain is not valid';
    this.LogTag = 'AddressTrackerService';
    this.defaultPopulate = [{
      path: 'chainId',
      select: 'name symbol',
    }];
  }

  async addNewAddress(chainId = null, address = null, symbol = '', demo = false) {
    if (!chainId) {
      throw new Error(`${this.LogTag}: No chainId provided`);
    }
    if (!address) {
      throw new Error(`${this.LogTag}: No address provided`);
    }
    let currentAddresses;
    if (chainId) {
      currentAddresses = await this.findOne({ chainId }, {}, {
        populate: this.defaultPopulate,
      });
    } else {
      throw new Error(`${this.LogTag}: Could not find chain/symbol to add address to`);
    }
    console.log(currentAddresses);
    if (!currentAddresses) {
      return this.create({
        chainId,
        address: [address],
        symbol,
      });
    }
    if (currentAddresses) {
      const find = currentAddresses
        && currentAddresses.address && currentAddresses.address.find((x) => x === address);
      if (find) {
        logger.warn(`${this.LogTag}: Address (${address}) already exists in chain (${currentAddresses.chainId.symbol} | ${chainId})`);
        return false;
      }
      return this.updateById(currentAddresses._id, {}, {
        push: {
          address,
        },
      });
    }
    // // add chain address validator here
    // SendEvent(CONSTANTS.EVENT_TYPES.EVENT_CHAIN_ADDRESS_CREATED, null, {
    //   chainId,
    //   addressAdded: address,
    // }, demo);
  }
}

module.exports = new AddressTrackerService(AddressTrackerModel.Model, AddressTrackerModel.Schema);
