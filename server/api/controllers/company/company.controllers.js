var mongodbCrud = require('../../controllers/crudmongodb.controllers');
var config = require('../../../config/config');
var async = require("async");
var moment = require('moment');
moment().format();

domainUrl = config.SERVERURLDEV;
dbName = config.DBNAMEDEV;

module.exports.createCompanyData = function(req, res){

  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  var currentDate =  moment().format('DD-MM-YYYY');


  async.waterfall([
    function(callback){
      companyParams = {
        "db": dbName,
        "collectionName": "company",
     }

     mongodbCrud.retrieveAll(companyParams, function (retrieveRes) {
      if (retrieveRes.response.length > 0) {
        retrieveRes.response.forEach(function(eachData, index){
          var existingCName = eachData.companyName.toLowerCase();
          var newCName = jsonObj.companyName.toLowerCase();
          if(existingCName == newCName){
            returnData.code = 400;
            returnData.message = "Company already exists";
            returnData.error = "NA";
            returnData.data = "NA";
            if(retrieveRes.response.length -1 == index){
              callback(400, returnData);
            }
          } else {
            if(retrieveRes.response.length -1 == index){
              callback(null)
            }
          }
        })
      } else {
          callback(null);
        }
      });
    },
    function(callback){

      var companyDataParams = {
        "db": dbName,
        "collectionName": "company",
        "createData": {
            "companyId": jsonObj.companyName + '001',
            "companyName": jsonObj.companyName,
            "companyType": jsonObj.companyType,
            "companyContact": jsonObj.companyContact,
            "companyAddress": jsonObj.companyAddress,
            "createdDate": currentDate,
            "updateDate": null
        }
     }

     mongodbCrud.createData(companyDataParams, function (createDataRes) {
      if (createDataRes.status == 200) {
        returnData.code = 200;
        returnData.message = "Successfully created data in table company!";
        returnData.error = 'NA';
        returnData.data = "NA";
        callback(200, returnData);
      } else {
          returnData.code = 400;
          returnData.message = "Error in creating data in table company!";
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

module.exports.updateCompanyData =  function(req, res){

  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  var currentDate =  moment().format('DD-MM-YYYY');


  async.waterfall([
    function(callback){

      var updateParams = {
        "db": dbName,
        "collectionName": "company",
        "pkId": jsonObj.id,
        "updateData": {
           // "companyName": jsonObj.companyName,
            "companyType": jsonObj.companyType,
            "companyContact": jsonObj.companyContact,
            "companyAddress": jsonObj.companyAddress,
           // "createdDate": currentDate,
            "updateDate": currentDate
        }
     }

     mongodbCrud.updateData(updateParams, function (updateDataRes) {
      // console.log("User response : " +JSON.stringify(usersRes.data[0]._id));
      if (updateDataRes.status == 200) {
        returnData.code = 200;
        returnData.message = "Successfully updated data in table company!";
        returnData.error = 'NA';
        returnData.data = "NA";
        callback(200, returnData);
      } else {
          returnData.code = 400;
          returnData.message = "Error in updating data in table company!";
          returnData.error = updateDataRes.error;
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

module.exports.deleteCompanyData =  function(req, res){

  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){

      var deleteParams = {
        "db": dbName,
        "collectionName": "company",
        "pkId": jsonObj.id,
      }

     mongodbCrud.deleteData(deleteParams, function (deleteDataRes) {
      // console.log("User response : " +JSON.stringify(usersRes.data[0]._id));
      if (deleteDataRes.status == 200) {
        returnData.code = 200;
        returnData.message = "Successfully deleted data in table company!";
        returnData.error = 'NA';
        returnData.data = "NA";
        callback(200, returnData);
      } else {
          returnData.code = 400;
          returnData.message = "Error in deleting data in table company!";
          returnData.error = updateDataRes.error;
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