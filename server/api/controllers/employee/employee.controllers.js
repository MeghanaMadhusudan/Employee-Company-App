var mongodbCrud = require('../../controllers/crudmongodb.controllers');
var config = require('../../../config/config');
var async = require("async");
var moment = require('moment');
moment().format();

domainUrl = config.SERVERURLDEV;
dbName = config.DBNAMEDEV;

module.exports.createEmployeeData = function(req, res){

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
        "collectionName": "company"
     }

      mongodbCrud.retrieveAll(companyParams, function (retrieveRes) {
        if (retrieveRes.response.length > 0) {
          var filterRecord = retrieveRes.response.filter(function(eachData){
            if(jsonObj.companyId == eachData.companyId){
              return eachData;
            } 
          });
          if(filterRecord.length > 0){
            //if(retrieveRes.response.length -1 == index){
              callback(null, filterRecord[0])
            //}
          } else {
            returnData.code = 200;
            returnData.message = "No company found"
            callback(200, returnData)
          }
        }
      });
    },
    function(filteredCompanyRecord, callback){
      var employeeParams = {
        "db": dbName,
        "collectionName": "employee"
      }
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        if (retrieveRes.response.length > 0) {
          var filterRecord = retrieveRes.response.filter(function(eachData){
            if(jsonObj.employeeEmailId == eachData.employeeEmailId){
              return eachData;
            } 
          });
          if(filterRecord.length > 0){
            returnData.code = 200;
            returnData.message = "Email exists"
            callback(200, returnData)
          } else {
           // if(eachData.companyId == jsonObj.companyId){
            returnData.data = jsonObj;
            callback(null, returnData)
          }
        } else {
          returnData.data = jsonObj;
          callback(null,returnData);
        }
      });
    },
    function(employeeData,callback){
      var empObj = {};
      companyParams = {
        "db": dbName,
        "collectionName": "employee",
        "companyId": jsonObj.companyId
     }

     mongodbCrud.retrieveOne(companyParams, function (retrieveRes) { 
      if(retrieveRes.response.length > 0){
      retrieveRes.response.forEach(function(value, index){
        // if(value.employeeId == jsonObj.employeeRM || jsonObj.employeeRM == null){
          if(value.employeeId == jsonObj.employeeRM && value.companyId ==  jsonObj.companyId || jsonObj.employeeRM == null){
          empObj.data = value
        } else {
          empObj.message = "No employee found in the company"
        }
        if(retrieveRes.response.length -1 == index){
          callback(null,empObj)
        }
      })
    } else{
      callback(null,employeeData)
      }
     });
    },
    function(filteredEmployeeData,callback){
      
      if(filteredEmployeeData.data){
            var companyDataParams = {
              "db": dbName,
              "collectionName": "employee",
              "createData": {
                  "employeeId":  jsonObj.companyId + "-" + parseInt(Math.random() * 100),
                  "employeeName": jsonObj.employeeName,
                  "employeeEmailId": jsonObj.employeeEmailId,
                  "employeeRM": jsonObj.employeeRM,
                  "employeeContact": jsonObj.employeeContact,
                  "companyId" : jsonObj.companyId,
                  "createdDate": currentDate,
                  "updateDate": null
              }
          } 
          if(jsonObj.employeeRM == null){
            companyDataParams.createData.employeeRM = companyDataParams.createData.employeeId
          }

          mongodbCrud.createData(companyDataParams, function (createDataRes) {
            if (createDataRes.status == 200) {
              returnData.code = 200;
              returnData.message = "Successfully created data in table company!";
              returnData.error = 'NA';
              returnData.data = "NA";
              //if(filteredEmployeeData.length -1 == index){
                callback(200, returnData);
              //}      
            } else {
                returnData.code = 400;
                returnData.message = "Error in creating data in table company!";
                returnData.error = createDataRes.error;
                returnData.data = "NA";
               // if(filteredEmployeeData.length -1 == index){
                  callback(200, returnData);
                //} 
              }
            })
          } else{
            callback(null,filteredEmployeeData.message)
          }
      
  }


  ],
  function (err, result) {
    if (req.body) {
        res
            .status(200)
            .json(result)
    } else {
        res(result);
    }
  })
}


module.exports.updateEmployeeData =  function(req, res){

  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){

      var updateParams = {
        "db": dbName,
        "collectionName": "employee",
        "pkId": jsonObj.id,
        "updateData": {
            "employeeContact": jsonObj.employeeContact,
            "employeeRM": jsonObj.employeeRM
      }
    }

     mongodbCrud.updateData(updateParams, function (updateDataRes) {
      // console.log("User response : " +JSON.stringify(usersRes.data[0]._id));
      if (updateDataRes.status == 200) {
        returnData.code = 200;
        returnData.message = "Successfully updated data in table employee!";
        returnData.error = 'NA';
        returnData.data = "NA";
        callback(200, returnData);
      } else {
          returnData.code = 400;
          returnData.message = "Error in updating data in table employee!";
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

module.exports.deleteEmployeeData =  function(req, res){

  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){

      var employeeParams = {
        "db": dbName,
        "collectionName": "employee"
      }
      var empArray= [];
    
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachData, index){
          if(eachData.employeeRM ==  jsonObj.employeeId){
            empArray.push(eachData);
          }
          if(empArray.length > 0){
            if(retrieveRes.response.length -1  == index){
              callback(null,empArray)
            }
          } else {
            returnData.message =  "No employee available to delete"
            if(retrieveRes.response.length -1  == index){
              callback(200,returnData)
            }
          }
        })

      });
    },
    function(empData,callback){
      empData.forEach(function(eachEmp,index){
        var updateParams = {
          "db": dbName,
          "collectionName": "employee",
          "pkId": eachEmp._id,
          "updateData": {
              "employeeRM": null
        }
      }
        mongodbCrud.updateData(updateParams, function (updateDataRes) {
          if(empData.length -1 == index){
          callback(null);
          }
        });
      })
    },
    function(callback){

      var deleteParams = {
        "db": dbName,
        "collectionName": "employee",
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


module.exports.searchEmployee = function(req,res){
  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){
      var employeeParams = {
        "db": dbName,
        "collectionName": "employee",
      }
      var empData = [];
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachData, index){
          if(eachData.employeeContact == jsonObj.employeeContact || eachData.employeeName == jsonObj.employeeName || eachData.employeeId == jsonObj.employeeId){
            empData.push(eachData);
          }

          if(empData.length > 0){
            if(retrieveRes.response.length -1 == index){
              callback(null,empData)
            }
          } else {
            returnData.message = "Could not find employee"
            if(retrieveRes.response.length -1 == index){
              callback(null,returnData)
            }         
         }
        });
      })   
    }

  ],
  function (err, result) {
    if (req.body) {
        res
            .status(200)
            .json(result)
    } else {
        res(result);
    }
  })
}


module.exports.getEmployeeDataById =  function(req, res){
  var returnData = {};

  if (req.body) {
      jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
  } else {
      jsonObj = req;
  }

  async.waterfall([
    function(callback){
      var employeeParams = {
        "db": dbName,
        "collectionName": "employee",
      }
      var employeeManager = {};
      var subordinate = [];
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachData, index){
          if(eachData.employeeId == jsonObj.employeeId){
            employeeManager = eachData.employeeRM; 
          } 
          if(eachData.employeeRM == jsonObj.employeeId){
            subordinate.push(eachData.employeeId);
          }
          if( retrieveRes.response.length - 1 == index){
            callback(null, {
              "Manager" : employeeManager,
              "Subordinate" : subordinate
            })
          }
        });
      })   
    }

  ],
  function (err, result) {
    if (req.body) {
        res
            .status(200)
            .json(result)
    } else {
        res(result);
    }
  })

}