let async = require('async');
let lodash = require('lodash');
let variableDbo = require('../dbos/variable.dbo');
/**
* @api {post/put} /variable To add or update a variable.
* @apiName updateVariable
* @apiGroup Variables
* @apiParam {String} name Name of the variable.
* @apiParam {String} value Value of the variable.
* @apiParam {String} appCode Type of app used [SLC/SNC].
* @apiParam {String} varType Variable used in [ DASH : dashboard / LEAD : leaderboard ].
* @apiError ErrorWhileSavingInfo Error while saving information.
* @apiErrorExample ErrorWhileSavingInfo-Response:
* {
*   success: false,
*   message: 'Error while saving information'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   message: "Variable info saved successfully.",
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
          message: '  Error while saving variable information'
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

/**
* @api {get} /variable To get a variable information.
* @apiName getVariable
* @apiGroup Variables
* @apiParam {String} name Optional name of the variable.
* @apiParam {String} appCode Type of app used [SLC/SNC].
* @apiParam {String} varType Variable used in [ DASH : dashboard / LEAD : leaderboard ].
* @apiError ErrorWhileFetchingInfo Error while fetching variable.
* @apiErrorExample ErrorWhileFetchingInfo-Response:
* {
*   success: false,
*   message: 'Error while fetching information'
* }
*@apiSuccessExample Response : 
* {
*   success: true,
*   info: {
*           "appCode": "SLC",
*           "name": "title",
*           "varType": "LEAD",
*           "updatedOn": "2018-08-28T11:37:05.943Z",
*           "value": "REFERRAL LEADERBOARD"
*       }
* }
*/
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
          // let object = {};
          // lodash.forEach(result,element => {
          //       object[element.name] = element.value  
          // });
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