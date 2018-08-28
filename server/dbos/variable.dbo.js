let VariableModel = require('../models/variable.model');
let getVariable = (object, cb) => {
  VariableModel.find(object , { _id: 0 }, (error, result) => {
    if (error) cb(error, null);
    else cb(null, result || []);
  });
}

let updateVariable = (object, cb) => {
  let { name, appCode, varType } = object;
  console.log(object);
  VariableModel.updateOne({ appCode, varType, name }, {
    $set: object
  }, {
      upsert: true
    }, (error, result) => {
      console.log(result);
      if (error) cb(error, null);
      else cb(null, result);
    })

}
// let updateVariable = (object,cb) =>{
//     let { name,
//     value, updatedOn } = object;
//     VariableModel.findOneAndUpdate({ name },{
//             $set: { 'value':value, 'updatedOn': updatedOn } }, (error, result) => {
//                 if (error) cb(error, null);
//                 else cb(null, result || []);
//             }
//     );
// }

module.exports = {
  getVariable,
  updateVariable
};