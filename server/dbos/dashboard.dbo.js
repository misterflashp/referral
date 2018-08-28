let AccountModel = require('../models/account.model');

let searchByText = (searchKey,arr, cb) => {
    AccountModel.find({
        "$or":arr
     }, (error, result) => {
        console.log(error, result);
        if (error) cb(error, null);
        else cb(null, result);
    });
}
module.exports = {
    searchByText
}