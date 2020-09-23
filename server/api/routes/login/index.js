/* -----------------------------------------------------------------
**Variable declaration
-------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var ctrlLogin = require('../../controllers/login/login.js');

/* ---------------------------------------------------------------
** Set Routes
---------------------------------------------------------------- */

//Used during Mongodb signUp 
router
  .route('/createAdmin')
  .post(ctrlLogin.createAdmin);  

router
  .route('/adminLogin')
  .post(ctrlLogin.adminLogin);  

module.exports = router;
