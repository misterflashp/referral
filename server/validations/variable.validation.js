let joi = require('joi');

let getVariable = (req, res, next) => {
  let getVariableSchema = joi.object().keys({
    name: joi.string(),
    appCode: joi.string().required(),
    varType: joi.string().required()
  });
  let { error } = joi.validate(req.query, getVariableSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

let updateVariable = (req, res, next) => {
  let updateVariableSchema = joi.object().keys({
    name: joi.string().required(),
    value: joi.any().required(),
    appCode: joi.string().required(),
    varType: joi.string().required()
  });
  let { error } = joi.validate(req.body, updateVariableSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};
module.exports = {
  getVariable,
  updateVariable
};