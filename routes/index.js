var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { handleIndexPage, handleUserRemoval, handleAddUserPage, handleAddUser, handleAssignPage, handleAddTask } = require('../controllers/indexControllers');
const { handleAdminHomePage, handleLoginPage, handleLogIn } = require('../controllers/userControllers');
const { authenticateLogin } = require('../middlewares/auth');


/* GET home page. */
router.get('/', handleIndexPage);

router.get('/deleteuser/:id', handleUserRemoval);

router.get('/adduser', handleAddUserPage)
      .post('/adduser', handleAddUser)
      .get('/assigntask/:id', handleAssignPage)
      .post('/assigntask/:id', handleAddTask)
      .get('/adminhomepage', handleAdminHomePage)
      .get('/login', handleLoginPage)
      .post('/login', handleLogIn)


module.exports = router;
