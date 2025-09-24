const BN = require('bignumber.js');

const { Cruds, SendEvent } = require('src/common/handlers');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../common/data/constants');
const MarkupModel = require('./markup.model');

let customerService;

class Markup extends Cruds {
  async deleteById(id) {
    const obj = await this.findById(id);
    if (!obj) {
      throw new Error('Record does not exist');
    }
    if (obj.isDefault) {
      throw new Error('Default markup cannot be deleted');
    }
    return super.deleteById(id);
  }

  /**
   * @param {MarkupModel} markupData
   * @param {String} market symbol/market symbol
   * @returns {*Object} data
   * @returns {*Number} data.value Absolute/Percent value
   * @returns {*Boolean} data.isPercentage Boolean value describing the above param
   */
  getMarkupForMarketFromData(markupData = {}, market = null) {
    let data = markupData;
    if (!market || !markupData.markets || !markupData.markets[market]) {
      data = {
        _id: markupData._id,
        value: markupData.value || 0,
        isPercentage: markupData.isPercentage || false,
      };
    } else {
      data = {
        _id: markupData._id,
        value: markupData.markets[market].value || 0,
        isPercentage: markupData.isPercentage || false,
      };
    }
    return data;
  }

  /**
   * @param {String} markupId
   * @returns {MarkupModel}
   */
  async getMarkupData(markupId = null) {
    let data;
    if (markupId) data = await this.findOne({ _id: markupId, active: true });
    else data = await this.findOne({ isDefault: true });
    return data;
  }

  async updateMarkup(id, params = {}, updatedBy) {
    const oldData = await this.findById(id);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UPDATE_MARKUP,
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
   * @param {*Object} markupDetails Markup Data Information
   * @param {*Number} markupDetails.value Absolute/Percent value
   * @param {*Boolean} markupDetails.isPercentage Boolean value describing the above param
   * @param {*Number} price
   * @param {*Boolean} bignumber
   * @returns {*BigNumber/String} Returns the calculated marpked up amount
   */
  getMarkedUpAmount(markupDetails, price, pairName, bignumber = false) {
    // if (!markupDetails && markupId) {
    //   markupDetails = await this.findOne({ _id: markupId, active: true });
    //   logger.info('Please provide mark up details to increase performace');
    // }
    if (!markupDetails) return bignumber ? new BN(price) : price;
    let priceBN = new BN(price);
    let {
      isPercentage = false,
      value = 1,
    } = markupDetails;
    if (markupDetails.markets && markupDetails.markets[pairName]) {
      value = markupDetails.markets[pairName].value;
    }
    const valueBN = new BN(value);
    if (isPercentage) {
      priceBN = priceBN.plus(priceBN.multipliedBy(new BN(value).dividedBy(100)));
    } else {
      priceBN = priceBN.plus(valueBN);
    }
    return bignumber ? priceBN : priceBN.toString();
  }

  getMarkedUpAmountOB(markupDetails, price, pairName, bignumber = false) {
    // if (!markupDetails && markupId) {
    //   markupDetails = await this.findOne({ _id: markupId, active: true });
    //   logger.info('Please provide mark up details to increase performace');
    // }
    if (!markupDetails) return bignumber ? new BN(price) : price;
    let priceBN = parseFloat(price);
    let {
      isPercentage = false,
      value = 1,
    } = markupDetails;
    if (markupDetails.markets && markupDetails.markets[pairName]) {
      value = markupDetails.markets[pairName].value;
    }
    const valueBN = parseFloat(value);
    if (isPercentage) {
      priceBN += (priceBN * (valueBN / 100));
      // priceBN = priceBN.plus(priceBN.multipliedBy(new BN(value).dividedBy(100)));
    } else {
      priceBN += valueBN;
    }
    return priceBN.toString();
  }

  getMarkedDownAmount(markupDetails, price, pairName, bignumber = false) {
    // if (!markupDetails && markupId) {
    //   markupDetails = await this.findOne({ _id: markupId, active: true });
    //   logger.info('Please provide mark up details to increase performace');
    // }
    if (!markupDetails) return price;
    let priceBN = new BN(price);
    let {
      isPercentage = false,
      value = 1,
    } = markupDetails;
    if (markupDetails.markets && markupDetails.markets[pairName]) {
      value = markupDetails.markets[pairName].value;
    }
    const valueBN = new BN(value);
    if (isPercentage) {
      priceBN = priceBN.minus(priceBN.multipliedBy(new BN(value).dividedBy(100)));
    } else {
      priceBN = priceBN.minus(valueBN);
    }
    return bignumber ? priceBN : priceBN.toString();
  }

  getMarkedDownAmountOB(markupDetails, price, pairName, bignumber = false) {
    // if (!markupDetails && markupId) {
    //   markupDetails = await this.findOne({ _id: markupId, active: true });
    //   logger.info('Please provide mark up details to increase performace');
    // }
    if (!markupDetails) return price;
    let priceBN = parseFloat(price);
    let {
      isPercentage = false,
      value = 1,
    } = markupDetails;
    if (markupDetails.markets && markupDetails.markets[pairName]) {
      value = markupDetails.markets[pairName].value;
    }
    const valueBN = parseFloat(value);
    if (isPercentage) {
      priceBN -= (priceBN * (valueBN / 100));
    } else {
      priceBN -= valueBN;
    }
    return priceBN.toString();
  }

  /**
   * @param {*String} customerId
   * @returns {MarkupModel} Markup Data object
   */
  async getMarkupDataForCustomer(customerId) {
    let markupData = null;
    const customerWithMarkup = await customerService.findById(customerId, {}, true, [{
      path: 'markupId',
      select: 'isPercentage value markups markets',
    }]);
    if (customerWithMarkup && customerWithMarkup.markupId) {
      markupData = customerWithMarkup.markupId;
    } else {
      markupData = await this.findOne({
        isDefault: true,
      });
    }
    return markupData;
  }
}

module.exports = new Markup(MarkupModel.Model, MarkupModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  customerService = services.customerService;
}, 0);
