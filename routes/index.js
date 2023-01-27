var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { handleIndexPage, handleUserRemoval, handleAddUserPage, handleAddUser } = require('../controllers/indexControllers');


/* GET home page. */
router.get('/', handleIndexPage);

router.get('/deleteuser/:id', handleUserRemoval);

router.get('/adduser', handleAddUserPage)
      .post('/adduser' , handleAddUser)



module.exports = router;
