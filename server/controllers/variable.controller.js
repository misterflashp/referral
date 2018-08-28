let async = require('async');
let variableDbo = require('../dbos/variable.dbo');
/**
* @api {post} /variable To add a message.
* @apiName addMessage
* @apiGroup Message
* @apiParam {String} message Message to be saved.
* @apiError ErrorWhileAddingMessage Error while adding the message.
* @apiErrorExample ErrorWhileAddingMessage-Response:
* {
*   success: false,
*   message: 'Error while saving message'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   list: {
*    "message": "This is the message",
*    "updatedOn": "2018-08-17T12:36:45.361Z"
*   }
* }
*/


let updateVariable = (req, res) => {
  let { name,
    value, appCode, varType } = req.body;
  let updatedOn = Date.now();
  async.waterfall([
    (next) => {
      variableDbo.updateVariable({ name, value, varType, appCode, updatedOn }, (error, result) => {
        if (error) next({
          status: 500,
          message: 'error while saving'
        }, null);
        else {
          next(null, {
            status: 200,
            message: "Variable info saved successfully."
          });
        }
      });
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}

let getVariable = (req, res) => {
  let {
    name, appCode, varType } = req.query;

  async.waterfall([
    (next) => {
      if (name) {
        variableDbo.getVariable({ appCode, name, varType }, (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while fetching variable'
          }, null);
          else next(null, {
            status: 200,
            info: result
          });
        });
      }
      else {
        variableDbo.getVariable({ appCode, varType }, (error, result) => {
          if (error) next({
            status: 500,
            message: 'Error while fetching variables'
          }, null);
          else next(null, {
            status: 200,
            info: result
          });
        });
      }
    }], (error, result) => {
      let response = Object.assign({
        success: !error
      }, error || result);
      let status = response.status;
      delete (response.status);
      res.status(status).send(response);
    });
}

module.exports = {
  updateVariable,
  getVariable
};