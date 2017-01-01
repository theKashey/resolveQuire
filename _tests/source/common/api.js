var helper = require('../helper');

module.exports = {
  method: function () {
    return 'api';
  },
  indirect: function () {
    return helper.method();
  }
};