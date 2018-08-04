let joi = require('joi');


let bonusClaim = (req, res, next) => {
  let bonusClaimSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.body, bonusClaimSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let getBonusInfo = (req, res, next) => {
  let getBonusInfoSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.query, getBonusInfoSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  bonusClaim,
  getBonusInfo
};