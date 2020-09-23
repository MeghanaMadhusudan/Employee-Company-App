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
          console.log("retrieveRes", JSON.stringify(retrieveRes))
          var filterRecord = retrieveRes.response.filter(function(eachData){
            console.log("eachData", JSON.stringify(eachData))
            console.log("jsonObj.companyId == eachData.companyId)", jsonObj.companyId == eachData.companyId)
            if(jsonObj.companyId == eachData.companyId){
              return eachData;
            } 
          });
          console.log("filterRecoed", JSON.stringify(filterRecord))
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
      console.log("filteredCompanyRecord", JSON.stringify(filteredCompanyRecord))
      var employeeParams = {
        "db": dbName,
        "collectionName": "employee"
      }
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        if (retrieveRes.response.length > 0) {
          console.log("retrieveRes", JSON.stringify(retrieveRes))
          var filterRecord = retrieveRes.response.filter(function(eachData){
            console.log("eachData", JSON.stringify(eachData))
            console.log("jsonObj.employeeEmailId == eachData.employeeEmailId)", jsonObj.employeeEmailId == eachData.employeeEmailId)
           
            console.log("each data of company id", eachData.companyId)
            if(jsonObj.employeeEmailId == eachData.employeeEmailId){
              return eachData;
            } 
          });
          console.log("filterRecoed", JSON.stringify(filterRecord))
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
      console.log("data", JSON.stringify(employeeData))
      var empObj = {};
      companyParams = {
        "db": dbName,
        "collectionName": "employee",
        "companyId": jsonObj.companyId
     }

     mongodbCrud.retrieveOne(companyParams, function (retrieveRes) { 
      console.log("personRes", retrieveRes)
      if(retrieveRes.response.length > 0){
      retrieveRes.response.forEach(function(value, index){
        console.log("value.employeeRM ", value.employeeRM )
        console.log("jsonObj.employeeRM", jsonObj.employeeRM )
        console.log("value.employeeRM == jsonObj.employeeRM",value.employeeRM == jsonObj.employeeRM )


        // if(value.employeeId == jsonObj.employeeRM || jsonObj.employeeRM == null){
          if(value.employeeId == jsonObj.employeeRM && value.companyId ==  jsonObj.companyId || jsonObj.employeeRM == null){
          console.log("value in present", JSON.stringify(value))
          empObj.data = value
        } else {
          console.log("coming to else --")
          empObj.message = "No employee found in the company"
        }
        if(retrieveRes.response.length -1 == index){
          callback(null,empObj)
        }
      })
    } else{

      console.log("coming to 2nd else")
      callback(null,employeeData)
      }
     });
    },
    function(filteredEmployeeData,callback){
      
      console.log("filteredEmployeeData", JSON.stringify(filteredEmployeeData))
      if(filteredEmployeeData.data){
        // var employeeManager;
        // if(!jsonObj.employeeRM){
        //   employeeManager = 
        // }
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

          console.log("companyDataParams", companyDataParams)

          mongodbCrud.createData(companyDataParams, function (createDataRes) {
            console.log("User response : " +JSON.stringify(createDataRes));
            if (createDataRes.status == 200) {
              console.log("insidee if------")
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

    console.log("err", JSON.stringify(err))
    console.log("result", JSON.stringify(result))

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

  var currentDate =  moment().format('DD-MM-YYYY');


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

     console.log("updateParams", updateParams)

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

  var currentDate =  moment().format('DD-MM-YYYY');

  async.waterfall([
    function(callback){

      var employeeParams = {
        "db": dbName,
        "collectionName": "employee"
      }
      var empArray= [];
    
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        console.log("retrieveRes", JSON.stringify(retrieveRes))
        retrieveRes.response.forEach(function(eachData, index){
          console.log("eachData", JSON.stringify(eachData))
          if(eachData.employeeRM ==  jsonObj.employeeId){
            console.log("in condition", JSON.stringify(eachData))
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
      console.log("empData", JSON.stringify(empData))
      empData.forEach(function(eachEmp,index){
        var updateParams = {
          "db": dbName,
          "collectionName": "employee",
          "pkId": eachEmp._id,
          "updateData": {
              "employeeRM": null
        }
      }
      console.log("updateParams", updateParams)
        mongodbCrud.updateData(updateParams, function (updateDataRes) {
          console.log("updateDataRes in delete", JSON.stringify(updateDataRes))
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

     console.log("deleteParams", deleteParams)

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
      console.log("employeeParams", employeeParams)
      var empData = [];
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachData, index){
          console.log("eachData", JSON.stringify(eachData))
          if(eachData.employeeContact == jsonObj.employeeContact || eachData.employeeName == jsonObj.employeeName || eachData.employeeId == jsonObj.employeeId){
            console.log("inside data", JSON.stringify(eachData));
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
      console.log("employeeParams", employeeParams)
      var employeeManager = {};
      var subordinate = [];
      mongodbCrud.retrieveAll(employeeParams, function (retrieveRes) {
        retrieveRes.response.forEach(function(eachData, index){
          console.log("eachData", JSON.stringify(eachData))
          if(eachData.employeeId == jsonObj.employeeId){
            console.log("inside data", JSON.stringify(eachData.employeeRM));
            employeeManager = eachData.employeeRM; 
            console.log("employeeManager", JSON.stringify(employeeManager))
          } 
          if(eachData.employeeRM == jsonObj.employeeId){
            console.log("coming to 2sn else", eachData.employeeId)
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