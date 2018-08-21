let joi = require('joi');


let addAccount = (req, res, next) => {
  let addAccountSchema = joi.object().keys({
    address: joi.string().regex(/^0x[a-fA-F0-9]{40}$/),
    deviceId: joi.string().required(),
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
  let { error } = joi.validate(req.body, updateAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let leaderBoard = (req, res, next) => {
  let leaderBoardSchema = joi.object().keys({
    sortBy: joi.string(),
    start: joi.number(),
    count: joi.number()
  });
  let { error } = joi.validate(req.query, leaderBoardSchema);
  if(error) res.status(422).send({
    success:false,
    error
  });
  else{
    next();
  }
}

let getAccount = (req, res, next) => {
  let getAccountSchema = joi.object().keys({
    deviceId: joi.string().required()
  });
  let { error } = joi.validate(req.query, getAccountSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addAccount,
  leaderBoard,
  updateAccount,
  getAccount
};