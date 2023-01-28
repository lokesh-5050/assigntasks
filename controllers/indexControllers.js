const connection = require("../database/config");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const short = require('short-uuid');
const { off } = require("../database/config");

const excel = require('exceljs');

exports.handleIndexPage = async (req, res, next) => {
    let sql = "SELECT *FROM users"
    connection.query(sql, (err, row) => {
        if (err) throw err;
        res.render('index', { title: 'Express', data: row });
    })
}

exports.handleUserRemoval = async (req, res, next) => {
    let userId = req.params.id
    let sql = `Delete From users Where id="${userId}" `;
    connection.query(sql, (err, row) => {
        if (err) throw err;
        res.redirect("/homePage")
    })
}

exports.handleAddUserPage = async (req, res, next) => {
    res.render('addUser')
}

exports.handleAddUser = (req, res, next) => {
    let data = { name: req.body.name, email: req.body.email, mobile: req.body.mobile, password: req.body.password }

    let checkQ = `Select *from users where name="${data.name}" AND email="${data.email}" `
    let userExist = connection.query(checkQ, (err, row) => {
        if (err) throw err;
        if (row.length === 0) {
            const uniqueId = short.generate()
            bcrypt.hash(data.password, 10, function (err, hashedp) {
                if (err) throw err;
                let sql = `Insert into users(name , email , mobile , id ,  password) values("${data.name}","${data.email}","${data.mobile}" , "${uniqueId}" , "${hashedp}") `;

                let setData = connection.query(sql, async (err, setted) => {
                    if (err) throw err;
                    const token = jwt.sign({ email: data.email, id: uniqueId }, "2347eghdshihf089r4w0aef", { expiresIn: '7d' });
                    res.redirect("/homePage")
                })
            })
        } else {
            res.render('errorPage', { msg: "User with given name and email exist " })
        }
    })



}

exports.handleAssignPage = async (req, res, next) => {
    let userId = req.params.id
    let sql = `Select *from users Where id="${userId}"`
    connection.query(sql, (err, user) => {
        if (err) throw err;
        user.forEach((usr) => {
            res.render('assignTask', { user: usr })
        })
    })
}

exports.handleAddTask = async (req, res, next) => {
    let id = req.params.id

    const taskMsg = req.body.task;

    let sqlSetTaskInUsers = `Update users Set tasks="${taskMsg}" Where id="${id}"`
    connection.query(sqlSetTaskInUsers, (err, user) => {
        if (err) throw err;
        console.log("adde to only");
    })
    const uniqueId = short.generate()
    let addToTasks = `Insert into tasks(id , task , assignedTo , pending) values("${uniqueId}" , "${taskMsg}" , "${id}" , true)`;
    connection.query(addToTasks, (err, addedToTask) => {
        if (err) throw err;
    })
    res.redirect("/homePage")
}

exports.handleAssignTaskPage = async (req, res, next) => {
    let sql = "SELECT *FROM users"
    connection.query(sql, (err, row) => {
        if (err) throw err;
        res.render('AssignTaskPage', { data: row })
    })
}

exports.handleMultipleUsersTask = async (req, res, next) => {
    const { usersId, task } = req.body
    if (typeof usersId === "object") {
        usersId.forEach(id => {
            let sqlSetTask = `Update users Set tasks="${task}" Where id="${id}"`
            connection.query(sqlSetTask, (err, added) => {
                if (err) throw err;
            })
            const uniqueId = short.generate()
            let addToTasks = `Insert into tasks(id , task , assignedTo) values("${uniqueId}" , "${task}" , "${id}")`
            connection.query(addToTasks, (err, addedToTask) => {
                if (err) throw err;
            })
        });
    } else {
        let sqlSetTask = `Update users Set tasks="${task}" Where id="${usersId}"`
        connection.query(sqlSetTask, (err, added) => {
            if (err) throw err;
        })
        const uniqueId = short.generate()
        let addToTasks = `Insert into tasks(id , task , assignedTo) values("${uniqueId}" , "${task}" , "${usersId}")`
        connection.query(addToTasks, (err, addedToTask) => {
            if (err) throw err;
        })
    }


    // res.send(req.body)
    res.redirect('/homePage')


}


exports.alltasksPage = async (req, res, next) => {
    let sql = "SELECT *FROM tasks  INNER JOIN users ON users.id=tasks.assignedTo;"
    connection.query(sql, (err, row) => {
        if (err) throw err;
        console.log(row);

        res.render('allTasks', { data: row })
    })
}
exports.handleRemoveTask = async (req, res, next) => {
    let taskId = req.params.id
    console.log(taskId);
    let sql = `Delete From tasks Where assignedTo="${taskId}" `;
    connection.query(sql, (err, row) => {
        if (err) throw err;
        console.log();
        res.redirect("back")
    })
}
exports.handleMarkDone = async (req, res, next) => {
    let taskId = req.params.id
    console.log(taskId);

    // let sql = `Update tasks Set pending=false Where assignedTo="${taskId}" `;
    // connection.query(sql, (err, row) => {
    //     if (err) throw err;
    //     console.log();
    //     res.redirect("back")
    // })

    let checkIsPending = `Select *from tasks where assignedTo="${taskId}"`;
    connection.query(checkIsPending, (err, data) => {
        if (err) throw err;
        console.log(data);
        if (data[0].pending === 'True') {
            console.log("in true");
            let sql = `Update tasks Set pending='false' Where assignedTo="${taskId}" `;
            connection.query(sql, (err, row) => {
                if (err) throw err;
                console.log(row, 162);
                res.redirect("back")
            })
        } else {
            let sql = `Update tasks Set pending='True' Where assignedTo="${taskId}" `;
            connection.query(sql, (err, row) => {
                if (err) throw err;
                console.log();
                res.redirect("back")
            })
        }
    })
}

exports.handleExcelExport = async (req, res, next) => {
    let sqlUsers = "Select *from users"
    connection.query(sqlUsers, (err, users, fileds) => {
        const jsonUsers = JSON.parse(JSON.stringify(users));
        console.log(jsonUsers);

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Users')

        worksheet.columns = [
            { header: 'id', key: 'id', width: 40 },
            { header: 'name', key: 'name', width: 40 },
            { header: 'email', key: 'email', width: 40 },
            { header: 'mobile', key: 'mobile', width: 40, outlineLevel: 1 },
            { header: 'password', key: 'password', width: 100, outlineLevel: 1 },
            { header: 'tasks', key: 'tasks', width: 100, outlineLevel: 1 },
            { header: 'options', key: 'options', width: 10, outlineLevel: 1 }
        ];

        worksheet.addRows(jsonUsers);

        workbook.xlsx.writeFile("Users.xlsx")
            .then(function () {
                console.log("file saved!");
            });



    })

    //here

    let sqlTasks = "Select *from tasks"
    connection.query(sqlTasks, (err, tasks, fileds) => {
        const jsonTasks = JSON.parse(JSON.stringify(tasks));
        console.log(jsonTasks);

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Tasks')

        worksheet.columns = [
            { header: 'Id', key: 'id', width: 40 },
            { header: 'Task', key: 'task', width: 30 },
            { header: 'AssignedTo', key: 'assignedTo', width: 40 },
            { header: 'Pending', key: 'pending', width: 10, outlineLevel: 1 }
        ];

        worksheet.addRows(jsonTasks);

        workbook.xlsx.writeFile("Tasks.xlsx")
            .then(function () {
                console.log("file saved!");
            });




    }
    )
    connection.end(function (err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    });

    res.redirect("/homePage")
}


exports.handleLogout = async(req,res,next)=>{
    res.clearCookie("x-access-token")
    res.redirect('/homePage')
}