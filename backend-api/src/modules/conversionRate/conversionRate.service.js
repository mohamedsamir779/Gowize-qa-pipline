const { Cruds } = require('src/common/handlers');
const {
  Types,
} = require('mongoose');
const ConversionRateModel = require('./conversionRate.model');
const AssetService = require('../wallet/asset/asset.service');

class ConversionRateSevice extends Cruds {
  // get all conversion rates automatically calling a remote API
  async getAllConversionRates(usdtData, currenciesData) {
    const assets = await AssetService.getAllAssets();
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(currenciesData.rates)) {
      if (assets.includes(key)) {
        const conversionRate = await this.Model.findOne({ targetCurrency: `${key}` });
        if (conversionRate) {
          await this.createOrUpdate(
            { targetCurrency: `${key}` },
            {
              $set: {
                targetCurrency: key,
                value,
              },
            },
            {
              new: true,
              upsert: true,
            },
          );
        } else {
          const newConversionRate = new ConversionRateModel.Model({ targetCurrency: `${key}`, value: `${value}` });
          await newConversionRate.save();
        }
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(usdtData.rates)) {
      if (assets.includes(key)) {
        const conversionRate = await this.Model.findOne({ targetCurrency: `${key}` });
        if (conversionRate) {
          await this.createOrUpdate(
            { targetCurrency: `${key}` },
            {
              $set: {
                targetCurrency: key,
                value,
              },
            },
            {
              new: true,
              upsert: true,
            },
          );
        } else {
          const newConversionRate = new ConversionRateModel.Model({ targetCurrency: `${key}`, value: `${value}` });
          await newConversionRate.save();
        }
      }
    }
  }

  // get conversion rate from one currency to another
  async getConversionRate(params) {
    const { baseCurrency, targetCurrency } = params;
    if (baseCurrency === targetCurrency) {
      return 1;
    }
    if (baseCurrency === 'USD') {
      const conversionRateObejct = await this.Model.findOne({ targetCurrency, baseCurrency });
      return conversionRateObejct.value;
    }
    if (targetCurrency === 'USD') {
      const conversionRateObejct = await this.Model.findOne({
        targetCurrency: baseCurrency,
        baseCurrency: targetCurrency,
      });
      return 1 / parseFloat(conversionRateObejct?.value || 1);
    }
    const baseObject = await this.Model.findOne({ targetCurrency: baseCurrency });
    const targetObject = await this.Model.findOne({ targetCurrency });
    if (!baseObject || !targetObject) {
      throw new Error('Currency does not exist in the assets');
    }
    return (parseFloat(baseObject.value) / parseFloat(targetObject.value));
  }

  // get conversion value from one currency to another
  async getConversionRateValue(params) {
    const { baseCurrency, targetCurrency, amount } = params;
    const conversionRate = await this.getConversionRate({ baseCurrency, targetCurrency });
    if (!conversionRate) {
      throw new Error('Currency does not exist in the assets');
    }
    return (conversionRate * amount);
  }

  // get all conversion rates
  async getPaginate(params) {
    const {
      page,
      limit,
      sort,
    } = params;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sort: { createdAt: -1 },
    };
    if (sort) {
      options.sort = sort;
    }
    const query = {};
    if (params.baseCurrency) {
      query.baseCurrency = params.baseCurrency;
    }
    if (params.targetCurrency) {
      query.targetCurrency = params.targetCurrency;
    }
    return this.findWithPagination(query, options);
  }

  // create conversion rate
  async createRecord(params) {
    const { targetCurrency, baseCurrency, value } = params;
    const rec = await this.create({
      targetCurrency,
      baseCurrency,
      value,
      isFromCRM: true,
    });
    return rec;
  }

  // update conversion rate
  async update(id, params) {
    const convertObj = await this.findOne({
      _id: Types.ObjectId(id),
      isFromCRM: true,
    });
    if (!convertObj) {
      throw new Error('Conversion rate does not exist');
    }
    return this.updateById(id, {
      value: params.value ? params.value : convertObj.value,
      targetCurrency: params.targetCurrency ? params.targetCurrency : convertObj.targetCurrency,
      baseCurrency: params.baseCurrency ? params.baseCurrency : convertObj.baseCurrency,
    });
  }
}

module.exports = new ConversionRateSevice(ConversionRateModel.Model, ConversionRateModel.Schema);
