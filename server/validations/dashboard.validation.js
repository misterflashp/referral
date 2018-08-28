let joi = require('joi');

let getDashBoard = (req, res, next) => {
  let getDashBoardSchema = joi.object().keys({
    sortBy: joi.string(),
    start: joi.number(),
    count: joi.number(),
    order: joi.string()
  });
  let { error } = joi.validate(req.query, getDashBoardSchema);
  if (error) res.status(422).send({
    success: false,
    error
  });
  else next();
};

module.exports = {
  getDashBoard
};