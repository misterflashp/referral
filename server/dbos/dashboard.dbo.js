let AccountModel = require('../models/account.model');

let searchByText = (arr, cb) => {
    AccountModel.find({
        "$or": arr
    },{_id:0 }, (error, result) => {
        if (error) cb(error, null);
        else cb(null, result);
    });
}
module.exports = {
    searchByText
}