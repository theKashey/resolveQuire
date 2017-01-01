var api = require('./common/api.js');
var helper = require('./helper.js');
var fs = require('fs');


module.exports = {
  callApi: api.method,
  callHelper: helper.method,
  callFS: function(){
    return fs.readFile('./api.js')
  },
};