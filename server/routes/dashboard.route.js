let dashboardController = require('../controllers/dashboard.controller');
let dashboardValidation = require('../validations/dashboard.validation');


module.exports = (server) => {

  server.get('/dashboard', dashboardValidation.getDashBoard, dashboardController.getDashBoard);

  server.post('/dashboard/search', dashboardValidation.dashSearch, dashboardController.dashSearch);

};