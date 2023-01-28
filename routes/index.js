var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { handleIndexPage, handleUserRemoval, handleAddUserPage, handleAddUser, handleAssignPage, handleAddTask, handleAssignTaskPage, handleMultipleUsersTask, alltasksPage, handleRemoveTask, handleMarkDone, handleExcelExport } = require('../controllers/indexControllers');
const { handleAdminHomePage, handleLoginPage, handleLogIn } = require('../controllers/userControllers');
const { authenticateLogin } = require('../middlewares/auth');


/* GET home page. */
// router.get('/', handleIndexPage);

// router.get('/deleteuser/:id', handleUserRemoval);

// router.get('/adduser', handleAddUserPage)
//       .post('/adduser', handleAddUser)
//       .get('/assigntask/:id', handleAssignPage)
//       .post('/assigntask/:id', handleAddTask)
//       .get('/adminhomepage', handleAdminHomePage)
//       .get('/login', handleLoginPage)
//       .post('/login', handleLogIn)

//       .get('/assigntaskpage', handleAssignTaskPage)
//       .post('/addTaskss', handleMultipleUsersTask)

//       .get('/allTasks', alltasksPage)
//       .get('/removeTask/:id', handleRemoveTask)

//       .get('/doneTask/:id', handleMarkDone)



//better
router.get('/', handleLoginPage);

router.get('/deleteuser/:id', handleUserRemoval);

router.get('/adduser', handleAddUserPage)
      .post('/adduser', handleAddUser)
      .get('/assigntask/:id', handleAssignPage)
      .post('/assigntask/:id', handleAddTask)
      .get('/adminhomepage', handleAdminHomePage)
      .get('/homePage', authenticateLogin, handleIndexPage)
      .post('/login', handleLogIn)

      .get('/assigntaskpage', handleAssignTaskPage)
      .post('/addTaskss', handleMultipleUsersTask)

      .get('/allTasks', alltasksPage)
      .get('/removeTask/:id', handleRemoveTask)

      .get('/doneTask/:id', handleMarkDone)

      .get('/exportToExcel' , handleExcelExport)
module.exports = router;
