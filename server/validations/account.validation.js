let joi = require('joi');


let addAccount = (req, res, next) => {
  let addAccountSchema = joi.object().keys({
    deviceId: joi.string().required(),
    address: joi.string().regex(/^0x[a-fA-F0-9]{40}$/),
    referredBy: joi.string()
  });
  let { error } = joi.validate(req.body, addAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let updateAccount = (req, res, next) => {
  let updateAccountSchema = joi.object().keys({
    deviceId: joi.string().required(),
    address: joi.string().regex(/^0x[a-fA-F0-9]{40}$/).required()
  });
  let reqBody = Object.assign({}, req.body, req.params);
  let { error } = joi.validate(reqBody, updateAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getAccount = (req, res, next) => {
  let getAccountSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.params, getAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let addBonus = (req, res, next) => {
  let addBonusSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.params, addBonusSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getBonuses = (req, res, next) => {
  let getBonusesSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.params, getBonusesSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let bonusClaim = (req, res, next) => {
  let bonusClaimSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.params, bonusClaimSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addAccount,
  updateAccount,
  getAccount,
  addBonus,
  getBonuses,
  bonusClaim
};