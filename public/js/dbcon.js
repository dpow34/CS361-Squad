var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_joinnidr',
  password        : 'VPXVSaBsYkO56glG',
  database        : 'cs340_joinnidr'
});
module.exports.pool = pool;
