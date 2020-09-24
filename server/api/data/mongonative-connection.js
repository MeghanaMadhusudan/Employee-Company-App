/* ---------------------------------------------------------------
**Mongodb database connection
------------------------------------------------------------------*/
const MongoClient = require('mongodb').MongoClient;
var config = require('../../config/config.js');
const assert = require('assert');
var url;
// Connection URL

var _connection = null;
var client
//var domainUrl = "http://localhost:4200/";
if (config.type == 'DEVELOPMENT') {
     client = new MongoClient(config.DBSERVERURLDEV);
} 


var open = function () {

  // Use connect method to connect to the Server
  client.connect(function (err) {
    console.log("Connected successfully to server");
    //client.close();
  });
};

function get(dbName) {
  const db = client.db(dbName);
  _connection = db;
  return _connection;
}

module.exports = {
  open: open,
  get: get
};