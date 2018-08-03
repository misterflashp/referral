let joi = require('joi');


let addSession = (req, res, next) => {
  let addSessionSchema = joi.object().keys({
    deviceId: joi.string().required(),
    session: joi.object().keys({
      sessionId: joi.string().required(),
      paymentTxHash: joi.string()
    }).required()
  });
  let { error } = joi.validate(req.body, addSessionSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  addSession
};