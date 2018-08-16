let ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
let NUM = "0123456789";

let generateReferralId = () => {
  let id = "SENT-";
  for (let i = 0; i < 8; ++i) {
    id += i & 1 ? NUM.charAt(Math.floor(Math.random() * NUM.length)) :
      ALPHA.charAt(Math.floor(Math.random() * ALPHA.length));
  }
  return id.toUpperCase();
}

module.exports = {
  generateReferralId
};