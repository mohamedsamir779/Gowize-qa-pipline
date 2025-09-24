const { default: BigNumber } = require('bignumber.js');
const { Cruds, SendEvent } = require('src/common/handlers');

const { customerService } = require('src/modules/services');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../common/data/constants');
const FeeGroupModel = require('./feegroup.model');

class FeeGroup extends Cruds {
  async deleteById(id) {
    const obj = await this.findById(id);
    if (!obj) {
      throw new Error('Record does not exist');
    }
    if (obj.isDefault) {
      throw new Error('Default fee group cannot be deleted');
    }
    return super.deleteById(id);
  }

  async getFeeGroupForCustomer(customerId) {
    let feeData = null;
    const customerWithFee = await customerService.findById(customerId, {}, true, [{
      path: 'tradingFeeId',
      select: 'isPercentage value markups markets',
    }]);
    if (customerWithFee && customerWithFee.tradingFeeId) {
      feeData = customerWithFee.tradingFeeId;
    } else {
      feeData = await this.findOne({
        isDefault: true,
      });
    }
    return feeData;
  }

  async updateFee(id, params = {}, updatedBy) {
    const oldData = await this.findById(id);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UPDATE_TRADE_FEE,
      {
        customerId: null,
        userId: updatedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          oldData,
          newData: params,
        },
      },
    );
    return this.updateById(id, params);
  }

  /**
   * @param {FeeGroupModel} markupData
   * @param {String} market symbol/market symbol
   * @returns {*Object} data
   * @returns {*Number} data.value Absolute/Percent value
   * @returns {*Boolean} data.isPercentage Boolean value describing the above param
   */
  getFeeForMarketFromData(feeData = {}, market = null) {
    let data = feeData;
    if (!market || !feeData.markets || !feeData.markets[market]) {
      data = {
        _id: feeData._id,
        value: feeData.value || 0,
        isPercentage: feeData.isPercentage || 0,
        minValue: feeData.minValue,
        maxValue: feeData.maxValue,
      };
    } else {
      data = {
        _id: feeData._id,
        value: feeData.markets[market].value || 0,
        isPercentage: feeData.isPercentage || false,
        minValue: feeData.markets[market].minValue || 0,
        maxValue: feeData.markets[market].maxValue || 0,
      };
    }
    return data;
  }

  calculateFeeAmount(feeDetails, amount) {
    let {
      value,
      isPercentage,
      minValue,
      maxValue,
    } = feeDetails;
    let fee = new BigNumber(0);
    value = new BigNumber(value);
    minValue = new BigNumber(minValue);
    maxValue = new BigNumber(maxValue);
    amount = new BigNumber(amount);
    if (isPercentage) {
      fee = fee.plus(amount.multipliedBy(value.dividedBy(100)));
      if (fee.isLessThan(minValue)) {
        fee = minValue;
      } else if (fee.isGreaterThan(maxValue)) {
        fee = maxValue;
      }
    } else {
      fee = fee.plus(value);
    }
    return fee;
  }
}

module.exports = new FeeGroup(FeeGroupModel.Model, FeeGroupModel.Schema);
