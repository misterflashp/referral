let crc = require('crc');


let generateReferralId = (deviceId) => {
  return crc.crc32(deviceId).toString(36).padEnd(7, '0');
};

module.exports = {
  generateReferralId
};
