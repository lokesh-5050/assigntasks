var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { handleIndexPage, handleUserRemoval, handleAddUserPage, handleAddUser, handleAssignPage, handleAddTask, handleAssignTaskPage, handleMultipleUsersTask, alltasksPage, handleRemoveTask, handleMarkDone, handleExcelExport, handleLogout } = require('../controllers/indexControllers');
const { handleAdminHomePage, handleLoginPage, handleLogIn } = require('../controllers/userControllers');
const { authenticateLogin } = require('../middlewares/auth');


/* GET home page. */
//better
router.get('/', handleLoginPage)
      .get('/deleteuser/:id', handleUserRemoval)
      .get('/adduser', authenticateLogin, handleAddUserPage)
      .post('/adduser', authenticateLogin, handleAddUser)
      .get('/assigntask/:id', authenticateLogin, handleAssignPage)
      .post('/assigntask/:id', handleAddTask)
      .get('/homePage', authenticateLogin, handleIndexPage)
      .post('/login', handleLogIn)
      .get('/assigntaskpage', authenticateLogin, handleAssignTaskPage)
      .post('/addTaskss', handleMultipleUsersTask)
      .get('/allTasks', authenticateLogin, alltasksPage)
      .get('/removeTask/:id', authenticateLogin, handleRemoveTask)
      .get('/doneTask/:id', handleMarkDone)
      .get('/exportToExcel', handleExcelExport)
      .get('/logout' , handleLogout)
      .get("*", (req, res, next) => {
            
            res.render('noRoute')
      })
module.exports = router;
