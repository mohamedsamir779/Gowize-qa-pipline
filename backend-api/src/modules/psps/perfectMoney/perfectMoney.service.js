
/* eslint-disable class-methods-use-this */
const { logger } = require('src/common/lib');
const { jcc } = require('src/common/data').keys;
const crypto = require('crypto');

class FasapayService {
  async createHashJcc(order,params) {
    const { formatedAmt} = params
    const toEncrypt = `${jcc.apiPassword}${jcc.merchantId}${jcc.acqid}${order._id.toString()}${formatedAmt}${jcc.usdIso}`

    const sha1Signature = crypto.createHash('sha1').update(toEncrypt).digest('base64');
 //   const base64Sha1Signature = Base64.encode(sha1Signature);
    return sha1Signature
  }

  async verifyHashJcc(params = {}){
    const {OrderID, ResponseCode, ReasonCode, ResponseSignature} = params
    const toEncrypt = `${jcc.apiPassword}${jcc.merchantId}${jcc.acqid}${OrderID.toString()}${ResponseCode}${ReasonCode}`
    const sha1Signature = crypto.createHash('sha1').update(toEncrypt).digest('base64');
    //const base64Sha1Signature = Base64.encode(sha1Signature);
    return sha1Signature === ResponseSignature
  }
}

module.exports = new FasapayService();

