//

const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const AssetModel = require('./asset.model');

class AssetService extends Cruds {
  async createAsset(params, file) {
    params.minAmount = JSON.parse(params.minAmount);
    params.fee = JSON.parse(params.fee);
    const find = await this.findOne({ symbol: params.symbol });
    if (find) return find;
    logger.info(`Asset, ${params.name} [${params.symbol}] has been added by ${params.createdBy}`);
    params.image = file.filename;
    const data = await this.create(params);
    if (!this.assets) {
      this.assets = await this.getAllAssets();
      this.assets = this.assets.push(params.symbol);
    }
    return data;
  }

  async getAllAssets() {
    if (!this.assets) {
      logger.warn('Fetching assets from database');
      const data = await this.aggregate([
        {
          $group: {
            _id: null,
            assets: {
              $push: '$symbol',
            },
          },
        },
      ]);
      this.assets = data[0].assets;
    } else {
      logger.warn('Taking assets data from variable');
    }
    return this.assets;
  }
}

module.exports = new AssetService(AssetModel.Model, AssetModel.Schema);
