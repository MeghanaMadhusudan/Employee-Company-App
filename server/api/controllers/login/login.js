var mongodbCrud = require('../../controllers/crudmongodb.controllers');
var config = require('../../../config/config');
var async = require("async");
var moment = require('moment');
moment().format();

domainUrl = config.SERVERURLDEV;
dbName = config.DBNAMEDEV;

module.exports.createAdmin = function(req, res){
  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  var currentDate =  moment().format('DD-MM-YYYY');
  async.waterfall([
    function(callback){

      var createAdminParams = {
        "db": dbName,
        "collectionName": "login",
        "createData": {
          "userId" : jsonObj.userId,
          "userRole" : jsonObj.userRole,
          "createdDate": currentDate,
          "updateDate": null
        }
    } 

     mongodbCrud.createData(createAdminParams, function (createDataRes) {
      // console.log("User response : " +JSON.stringify(usersRes.data[0]._id));
      if (createDataRes.status == 200) {
        returnData.code = 200;
        returnData.message = "Successfully created admin data in table login!";
        returnData.error = 'NA';
        returnData.data = "NA";
        callback(200, returnData);
      } else {
          returnData.code = 400;
          returnData.message = "Error in creating admin data in table employee!";
          returnData.error = createDataRes.error;
          returnData.data = "NA";
          callback(400, returnData);
      }
    })
    }

  ],
  function (err, result) {
    if (req.body) {
        res
            .status(200)
            .json(returnData)
    } else {
        res(returnData);
    }
  })
}


module.exports.adminLogin = function(req, res){
  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){
      var userData = {
        "db": dbName,
        "collectionName": "login",
      }
      var userObj = {};
      mongodbCrud.retrieveAll(userData, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachValue, index){
          if(eachValue.userId == jsonObj.userId){
            userObj =  eachValue;
            if(userObj.userRole == "ADMIN"){     
              if(jsonObj.adminUserName == "ADMIN" && jsonObj.password == "admin123"){
              returnData.message = "Successfully logged in"
            } else {
              returnData.message = "Wrong Credentials"
            }
          }
          else{
            returnData.message ="You are not authozied to login"
          }
        }
        if(retrieveRes.response.length -1 == index){
          callback(null,returnData)
        }
        })
      });
    }

  ],
  function (err, result) {
    if (req.body) {
        res
            .status(200)
            .json(returnData)
    } else {
        res(returnData);
    }
  })
}