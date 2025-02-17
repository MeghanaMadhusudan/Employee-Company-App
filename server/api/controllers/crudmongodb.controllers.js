var dbconn = require('../data/mongonative-connection.js');
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var config = require('../../config/config');
var dbName;
var screenbuilderDbName;
//var domainUrl = "http://localhost:4200/";
if (config.type == 'DEVELOPMENT') {
    dbName = config.DBNAMEDEV;
    screenbuilderDbName = config.SCREENBUILDERDBNAMEDEV
} 

module.exports.createData = function (req, res) {
    if (req.body) {
        var jsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
    } else {
        var jsonObj = req;
    }
      var db = dbconn.get(dbName);

    console.log("body to create :" + JSON.stringify(jsonObj));
    // Fetch data from JSON in object form required for collection insert. For string use JSON.stringify
    var collectionDocument = jsonObj.createData;

    // fetch collection name from JSON in string format
    var collectionName = jsonObj.collectionName; // string form

    console.log('insertData: collectionDocument '+ collectionDocument);
    // Open the collection
    var collection = db.collection(collectionName);

    // If data is passed insert the document with callback funtion to handle return for error and success
    if (jsonObj) {
        collection.insertOne(collectionDocument, function (err, response) {
            console.log("response", JSON.stringify(response))
            // Handling errors
            if (err) {
                // console.log("Error inserting data" + err);
                if (req.body) {
                    res
                        .status(500)
                        .json({
                            "status": "500",
                            "message": "Error inserting data",
                            "error": err,
                            "response": response
                        });
                } else {
                    res(response)
                }


                // Handling success operation
            } else {
                if (req.body) {
                    res
                        .status(201)
                        .json({
                            "status": "200",
                            "message": "Data Inserted Successfully!",
                            "error": err,
                            "response": response,
                            "returnId": response.insertedId,
                            "data": response.ops
                        })
                } else {
                    res({
                        "status": "200",
                        "message": "Data Inserted Successfully!",
                        "error": err,
                        "response": response,
                        "returnId": response.insertedId,
                        "data": response.ops
                    })
                }


            }
        })

        // In case data is not passed 
    } else {
        // console.log("Data not passed to API");
        res
            .status(400)
            .json({
                "status": "400",
                "message": "Error inserting data",
                "error": err,
                "response": response
            })

    }
}

module.exports.updateData = function (req, res) {
    // open database connection

    if (req.body) {
        var locJsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
    } else {
        var locJsonObj = req;
    }

    // var db = dbconn.get(locJsonObj.db);
    var db = dbconn.get(dbName);


    var locUpdatedDocument = locJsonObj['updateData'];

    var locCollectionName = locJsonObj['collectionName']; // string form

    var locPkID = locJsonObj['pkId']; // string form

    console.log('updateData: locUpdatedDocument '+ JSON.stringify(locJsonObj));

    // Open the collection
    var locCollection = db.collection(locCollectionName);

    // If data is passed insert the document with callback funtion to handle return for error and success
    if (locJsonObj) {
        locCollection.findOneAndUpdate({ _id: ObjectId(locPkID) },
            { $set: locUpdatedDocument }, { new: true }, function (err, response) {
                console.log("response.value._id : "+JSON.stringify(response))
                // Handling errors
                if (err) {
                    // console.log("Error inserting data" + JSON.stringify(err));
                    // res
                    //   .status(500)
                    //   .json({
                    //           "status": "500",
                    //           "message" : "Error updating data",
                    //           "error" : err,
                    //           "response" : response
                    //   });
                    if (req.body) {
                        res
                            .status(500)
                            .json({
                                "status": "500",
                                "message": "Error inserting data",
                                "error": err,
                                "response": response
                            });
                    } else {
                        res(response)
                    }
                    // Handling success operation
                } else {
                    // console.log("Data Updated Successfully! ", response);
                    // res
                    //   .status(201)
                    //   .json({
                    //           "status": "200",
                    //           "message" : "Data updated Successfully!",
                    //           "error" : err,
                    //           "response" : response
                    //   })

                    if (req.body) {
                        console.log("response.value._id : "+JSON.stringify(response))
                        res
                            .status(201)
                            .json({
                                "status": "200",
                                "message": "Data updated Successfully!",
                                "error": err,
                                "response": response,
                                "returnId": response.value._id,
                                "data": response.value
                            })
                    } else {
                        res({
                            "status": "200",
                            "message": "Data updated Successfully!",
                            "error": err,
                            "response": response,
                            "returnId": response.value._id,
                            "data": response.value
                        })
                    }
                }
            })
        // In case data is not passed 
    } else {
        // console.log("Data not passed to API");
        // res
        //   .status(400)
        //   .json({
        //           "status": "400",
        //           "message" : "Error updating data",
        //           "error" : err,
        //           "response" : response
        //   })

        if (req.body) {
            res
                .status(500)
                .json({
                    "status": "500",
                    "message": "Error inserting data",
                    "error": err,
                    "response": response
                });
        } else {
            res(response)
        }

    }

}

module.exports.deleteData = function (req, res) {

    if (req.body) {
        var locJsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
    } else {
        var locJsonObj = req;
    }

    var db = dbconn.get(dbName);
    

    // fetch collection name from JSON in string format
    var locCollectionName = locJsonObj['collectionName']; // string form


    // fetch collection name from JSON in string format
    var locPkID = locJsonObj['pkId']; // string form

    // Open the collection
    var locCollection = db.collection(locCollectionName);

    // If data is passed insert the document with callback funtion to handle return for error and success
    if (locJsonObj) {
        locCollection.deleteOne({ _id: ObjectId(locPkID) }, function (err, response) {
            // Handling errors
            if (err) {
                //console.log("Error inserting data");
                
                if (req.body) {
                   res
                    .status(500)
                    .json({
                        "status": "500",
                        "message": "Error deleting data",
                        "error": err,
                        "response": response
                    });
                } else {
                    res({
                        "status": "500",
                        "message": "Error deleting data",
                        "error": err,
                        "response": response
                    })
                }
                // Handling success operation
            } else {
                // console.log("Data deleted Successfully! ", response);
                //
                if (req.body) {
                    res
                    .status(201)
                    .json({
                        "status": "200",
                        "message": "Data deleted Successfully!",
                        "error": err,
                        "response": response
                    });
                 } else {
                     res({
                        "status": "200",
                        "message": "Data deleted Successfully!",
                        "error": err,
                        "response": response
                    })
                 }
            }
        })
        // In case data is not passed 
    } else {
        console.log("Data not passed to API");
        res
            .status(400)
            .json({
                "status": "400",
                "message": "Error deleting data",
                "error": err,
                "response": response
            })

    }
}

module.exports.retrieveAll = function (req, res) {
    // Convert passed JSON in string format

    console.log('locJsonObj:'+(JSON.stringify(req)))
    // var locJsonObj = JSON.parse(JSON.stringify(req.body));
    // console.log('locJsonObj:'+locJsonObj)
    // Convert passwed JSON in string format
    if (req.body) {
        var locJsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
    } else {
        var locJsonObj = req;
    }

    // var db = dbconn.get(locJsonObj.db);
    var db = dbconn.get(dbName);
    // console.log("data sucess "+JSON.stringify(locJsonObj))

    // var locJsonObj = req.query.collectionName;
    // fetch collection name from JSON in string format
    var locCollectionName = locJsonObj['collectionName']; // string form

    //var locCollectionName =req.query.collectionName; // string form

    // var query = JSON.parse(req.query.queryStr);
    //console.log(query);
    // fetch collection name from JSON in string format
    var locPkID = locJsonObj['queryStr']; // string form
    var sortQuery = locJsonObj['sortQuery']; // string form
    // Open the collection
    var locCollection = db.collection(locCollectionName);

    //{ _id: ObjectId(locPkID)}
    // If data is passed insert the document with callback funtion to handle return for error and success
    if (locJsonObj) {
        if (sortQuery) {
            locCollection.find(locPkID).sort(sortQuery).toArray(
                function (err, response) {
                    //console.log("response on crudmongodb *********** " +JSON.stringify(response));
                    // Handling errors
                    if (err) {
                        //console.log("Error retrieving data");
                        // res
                        //   .status(500)
                        //   .json({
                        //           "status": "500",
                        //           "message" : "Error retrieving data",
                        //           "error" : err,
                        //           "response" : response
                        //   });
                        if (req.body) {
                            res
                                .status(500)
                                .json({
                                    "status": "500",
                                    "message": "Error retrieving data",
                                    "error": err,
                                    "response": response
                                });
                        } else {
                            res({
                                "status": "500",
                                "message": "Error retrieving data",
                                "error": err,
                                "response": response
                            })
                        }
                        // Handling success operation
                    } else {
                        // console.log(response);
                        // res
                        //   .status(201)
                        //    .json({
                        //          "status": "200",
                        //           "message" : "Data retrieved Successfully!",
                        //            "error" : err,
                        //            "response" : response
                        //    });
                        if (req.body) {
                            res
                                .status(200)
                                .json({
                                    "status": "200",
                                    "message": "Data retrieved Successfully!",
                                    "error": err,
                                    "response": response
                                });
                        } else {
                            res({
                                "status": "200",
                                "message": "Data retrieved Successfully!",
                                "error": err,
                                "response": response
                            })
                        }
                    }
                });
        }
        else {
            locCollection.find(locPkID).toArray(
                function (err, response) {
                    //console.log("response on crudmongodb *********** " +JSON.stringify(response));
                    // Handling errors
                    if (err) {
                        //console.log("Error retrieving data");
                        // res
                        //   .status(500)
                        //   .json({
                        //           "status": "500",
                        //           "message" : "Error retrieving data",
                        //           "error" : err,
                        //           "response" : response
                        //   });
                        if (req.body) {
                            res
                                .status(500)
                                .json({
                                    "status": "500",
                                    "message": "Error retrieving data",
                                    "error": err,
                                    "response": response
                                });
                        } else {
                            res({
                                "status": "500",
                                "message": "Error retrieving data",
                                "error": err,
                                "response": response
                            })
                        }
                        // Handling success operation
                    } else {
                        // console.log(response);
                        // res
                        //   .status(201)
                        //    .json({
                        //          "status": "200",
                        //           "message" : "Data retrieved Successfully!",
                        //            "error" : err,
                        //            "response" : response
                        //    });
                        if (req.body) {
                            res
                                .status(200)
                                .json({
                                    "status": "200",
                                    "message": "Data retrieved Successfully!",
                                    "error": err,
                                    "response": response
                                });
                        } else {
                            res({
                                "status": "200",
                                "message": "Data retrieved Successfully!",
                                "error": err,
                                "response": response
                            })
                        }
                    }
                });
        }


        // In case data is not passed 
    } else {
        // console.log("Data not passed to API");
        res
            .status(400)
            .json({
                "status": "400",
                "message": "Error retrieving data",
                "error": err,
                "response": response
            })

    }
}

module.exports.retrieveOne = function (req, res) {
    // Convert passed JSON in string format

    // Convert passwed JSON in string format
    if (req.body) {
        var locJsonObj = JSON.parse(JSON.stringify(req.body, null, 3));
    } else {
        var locJsonObj = req;
    }
    // var locJsonObj = JSON.parse(JSON.stringify(req.body));

    // var db = dbconn.get(locJsonObj.db);
    var db = dbconn.get(dbName);

    // var locJsonObj = req.query.collectionName;
    // fetch collection name from JSON in string format
    var locCollectionName = locJsonObj['collectionName']; // string form

    //var locCollectionName =req.query.collectionName; // string form

    // var query = JSON.parse(req.query.queryStr);
    //console.log(query);
    // fetch collection name from JSON in string format
    var locPkID = locJsonObj['_id']; // string form
    //var sortQuery = locJsonObj['sortQuery']; // string form
    console.log('updateData: locCollectionName 2' + locCollectionName);
    console.log('updateData: locPkID 3' + JSON.stringify(locPkID));
    // Open the collection
    var locCollection = db.collection(locCollectionName);

    //{ _id: ObjectId(locPkID)}
    // If data is passed insert the document with callback funtion to handle return for error and success
    if (locJsonObj) {

        // locCollection.find({ _id: ObjectId(locPkID) }).toArray(
            locCollection.find({ companyId: jsonObj.companyId },{ employeeId: jsonObj.employeeId},{ employeeName: jsonObj.employeeName},{ employeeContact: jsonObj.employeeContact}).toArray(

            function (err, response) {
                // Handling errors
                if (err) {
                    //console.log("Error retrieving data");
                    res
                        .status(500)
                        .json({
                            "status": "500",
                            "message": "Error retrieving data",
                            "error": err,
                            "response": response
                        });
                    // Handling success operation
                } else {

                    if (req.body) {
                        res
                            .status(200)
                            .json({
                                "status": "200",
                                "message": "Data retrieved Successfully!",
                                "error": err,
                                "response": response
                            });
                    } else {
                        res({
                            "status": "200",
                            "message": "Data retrieved Successfully!",
                            "error": err,
                            "response": response
                        })
                    }
                }
            });

        // In case data is not passed 
    } else {
        //  console.log("Data not passed to API");
        res
            .status(400)
            .json({
                "status": "400",
                "message": "Error retrieving data",
                "error": err,
                "response": response
            });

    }
}

