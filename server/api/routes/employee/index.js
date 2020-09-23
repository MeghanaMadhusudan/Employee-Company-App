/* -----------------------------------------------------------------
**Variable declaration
-------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var ctrlEmployee = require('../../controllers/employee/employee.controllers.js');

/* ---------------------------------------------------------------
** Set Routes
---------------------------------------------------------------- */

//Used during Mongodb signUp 
router
  .route('/createEmployeeData')
  .post(ctrlEmployee.createEmployeeData);  

router
  .route('/updateEmployeeData')
  .post(ctrlEmployee.updateEmployeeData);

router
  .route('/deleteEmployeeData')
  .post(ctrlEmployee.deleteEmployeeData);

router
  .route('/searchEmployee')
  .post(ctrlEmployee.searchEmployee);

router
  .route('/getEmployeeDataById')
  .post(ctrlEmployee.getEmployeeDataById);

module.exports = router;
