const connection = require("../database/config");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const short = require('short-uuid')
exports.handleIndexPage = async (req, res, next) => {
    let sql = "SELECT *FROM users"
    connection.query(sql, (err, row) => {
        if (err) throw err;
        res.render('index', { title: 'Express', data: row });
    })
}

exports.handleUserRemoval = async (req, res, next) => {
    let userId = req.params.id
    console.log(userId);
    let sql = `Delete From users Where id="${userId}" `;
    connection.query(sql, (err, row) => {
        if (err) throw err;
        console.log(row, "deleted");
        res.redirect("/")
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
        console.log(row, " millaa");
        console.log(row.length === 0);
        if (row.length === 0) {
            const uniqueId = short.generate()
            const hashedPassword = bcrypt.hash(data.password, 10 , function(err,res){
                if(err) throw err;
                console.log("40");
                console.log(res);
            })
            console.log(hashedPassword, "hashedPassword");
            let sql = `Insert into users(name , email , mobile , id ,  password) values("${data.name}","${data.email}","${data.mobile}" , "${uniqueId}" , "${hashedPassword}") `;

            let setData = connection.query(sql, async (err, setted) => {
                if (err) throw err;
                console.log(setted, " setted");
                const token = jwt.sign({ email: data.email, id: uniqueId }, "2347eghdshihf089r4w0aef", { expiresIn: '7d' });
                res.redirect("/")
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
        console.log(user);
        user.forEach((usr) => {
            res.render('assignTask', { user: usr })
        })
    })
}

exports.handleAddTask = async (req, res, next) => {
    let id = req.params.id
    console.log(id);

    const taskMsg = req.body.task

    let sqlFindUser = `Select *from users where id="${id}"`;
    connection.query(sqlFindUser, (err, user) => {
        if (err) throw err;
        if (user.length !== 0) {
            let sqlSetTask = `Update users Set tasks="${taskMsg}" Where id="${id}"`
            connection.query(sqlSetTask, (err, msgSetted) => {
                if (err) throw err;
                console.log(msgSetted);
                res.redirect("/")
            })
        } else {
            res.render('errorPage', { msg: "Can't find the user" })
        }
    })
}