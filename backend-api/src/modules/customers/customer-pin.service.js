const { Cruds } = require('src/common/handlers');
const { redis } = require('src/common/lib');
const { CONSTANTS } = require('src/common/data');
const CustomerPinModel = require('./customer-pin.model');

const {
  EMAIL_ACTIONS,
} = CONSTANTS;
let systemEmailService;

class CustomerPinService extends Cruds {
  async persistPin(email, payload, customer) {
    console.log("CustomerPinServicepayload  ",payload)
    const pin = await this.Model.findOneAndUpdate(
      { email },
      { ...payload, isActive: true },
      { new: true, upsert: true },
    );
    redis.setKey(`${email}:create_register_token:${pin}`);
    systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_OTP, {
      to: email,
      ...customer,
      pin: pin.value,
    });
    return pin;
  }

  async verifyEmailPin(email, pin) {
    const check = await this.Model.findOne({ email, value: pin });
    if (!check) return false;
    return check.isActive;
  }

  async invalidatePin(email) {
    const inv = await this.Model.findOneAndUpdate({ email }, { isActive: false });
    return inv;
  }
}
module.exports = new CustomerPinService(CustomerPinModel.Model, CustomerPinModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  systemEmailService = services.systemEmailService;
}, 0);
