let joi = require('joi');


let addReferral = (req, res, next) => {
  let addReferralSchema = joi.object().keys({
    clientAddress: joi.string().required(),
    referralAddress: joi.string().required()
  });
  let { error } = joi.validate(req.body, addReferralSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getReferralInfo = (req, res, next) => {
  let getReferralSchema = joi.object().keys({
    address: joi.string().required()
  });
  let { error } = joi.validate(req.query, getReferralSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let claimBonus = (req, res, next) => {
  let claimBonusSchema = joi.object().keys({
    address: joi.string().required()
  });
  let { error } = joi.validate(req.body, claimBonusSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addReferral,
  claimBonus,
  getReferralInfo
};