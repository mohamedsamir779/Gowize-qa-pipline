const Web3 = require('web3');
const {
  addressService,
  walletService,
} = require('src/modules/services');
const { Types } = require('mongoose');

const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

const addressTracker = require('../address-tracker/addresstracker.service');

module.exports = async function (agenda) {
  agenda.define('getEthBalanceUpdates', async () => {
    const ethAddresses = await addressTracker.findOne({ symbol: 'ETH' });
    const data = ethAddresses.addresses;
    for (let i = 0; i < data.length; i++) {
      const address = data[i];
      const balance = await web3.eth.getBalance(address);
      const balanceInEth = web3.utils.fromWei(balance.toString(), 'ether');
      // Find the address and populate the chainId for ETH for now.
      const addressRef = await addressService.findOne({
        address,
        chainId: '63347abf79ef683d54a6463d', // ETH chainId
      });
      if (!addressRef) {
        console.log("Address doesn't exist in the database");
        // eslint-disable-next-line no-continue
        continue;
      }
      const wallet = await walletService.findOne({
        networks: Types.ObjectId(addressRef._id),
      });
      if (!wallet) {
        console.log("Wallet doesn't exist in the database");
        // eslint-disable-next-line no-continue
        continue;
      }
      const updateObj = await walletService.updateById(wallet._id, {
        amount: balanceInEth,
      });
      if (!updateObj) {
        console.log('Error updating wallet');
        // eslint-disable-next-line no-continue
        continue;
      }
      addressTracker.updateBalance(address, balanceInEth);
    }
  });
};
