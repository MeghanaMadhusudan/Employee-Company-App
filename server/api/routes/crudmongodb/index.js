/* -----------------------------------------------------------------
**Variable declaration
-------------------------------------------------------------------*/
var express  = require('express');
var router   = express.Router();
var ctrlCrud = require('../../controllers/crudmongodb.controllers.js');


/* ---------------------------------------------------------------
** create data
---------------------------------------------------------------- */

router
  .route('/createData')
  .post(ctrlCrud.createData);


//---------------------------------------------------------------
// update data
//---------------------------------------------------------------

router
.route('/updateData')
.post(ctrlCrud.updateData);


//---------------------------------------------------------------
// delete data
//---------------------------------------------------------------

router
  .route('/deleteData')
  .post(ctrlCrud.deleteData);

//---------------------------------------------------------------
// retrive all
//---------------------------------------------------------------

router
  .route('/retrieveAll')
  .post(ctrlCrud.retrieveAll);


//---------------------------------------------------------------
// retrive data by key
//---------------------------------------------------------------

router
  .route('/retrieveOne')
  .post(ctrlCrud.retrieveOne);

module.exports = router;
