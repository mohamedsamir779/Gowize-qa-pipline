const { mt4Servie, mt5Servie, ctraderService } = require('src/modules/fx/_connection');
const getPlatform = (platform = 'MT5') => {
    switch (platform) {
      case 'MT5':
        return mt5Servie;
      case 'MT4':
        return mt4Servie;
      case 'CTRADER':
        return ctraderService;
      default:
        return null;
    }
  }
module.exports.getPlatform = getPlatform;