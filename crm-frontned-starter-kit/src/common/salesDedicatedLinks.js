const { 
  enableFX,
  enableCrypto,
  enableIB,
  enableMM,
  enableGold,
} = require("config");
const { cpUrl } = require("content");

let dedicatedLinks = [];
if (enableCrypto) {
  dedicatedLinks.push(`${cpUrl}/register/crypto/live`);
}
if (enableFX) {
  dedicatedLinks.push(`${cpUrl}/register/forex/live`);
  dedicatedLinks.push(`${cpUrl}/register/forex/demo`);
  if (enableIB) {
    dedicatedLinks.push(`${cpUrl}/register/forex/ib`);
  }
}

if (enableMM) {
  dedicatedLinks.push(`${cpUrl}/register/mm/live`);
}

if (enableGold) {
  dedicatedLinks.push(`${cpUrl}/register/gold/live`);
}

export default dedicatedLinks;