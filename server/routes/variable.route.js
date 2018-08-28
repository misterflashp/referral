let variableController = require('../controllers/variable.controller');
let variableValidation = require('../validations/variable.validation');

module.exports = (server) => {

  server.get('/variable', variableValidation.getVariable, variableController.getVariable);

  server.put('/variable', variableValidation.updateVariable, variableController.updateVariable);

  server.post('/variable', variableValidation.updateVariable, variableController.updateVariable);
};