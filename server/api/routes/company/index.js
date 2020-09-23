/* -----------------------------------------------------------------
**Variable declaration
-------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var ctrlCompany = require('../../controllers/company/company.controllers.js');

/* ---------------------------------------------------------------
** Set Routes
---------------------------------------------------------------- */
router
  .route('/createCompanyData')
  .post(ctrlCompany.createCompanyData);  

router
  .route('/updateCompanyData')
  .post(ctrlCompany.updateCompanyData);  

router
  .route('/deleteCompanyData')
  .post(ctrlCompany.deleteCompanyData);    

module.exports = router;

