const connection = require("../database/config")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
exports.handleAdminHomePage = async (req, res, next) => {
    res.render('adminpage')
}

exports.handleLoginPage = async (req, res, next) => {
    res.render('login')
}

exports.handleLogIn = async (req, res, next) => {
    let data = { email: req.body.email, password: req.body.password }
    try {
        let checkQ = `Select *from users Where email="${data.email}"`
        connection.query(checkQ, async (err, user) => {
            if (err) throw err;
            if (user.length === 0) {
                res.render('errorPage', { msg: "User does not exist" })
            } else {
                bcrypt.compare(data.password, user[0].password, (err, dp) => {
                    if (err) throw err;

                    if (!dp) {
                        res.render('errorPage', { msg: "Wrong Credentials" })
                    }

                    const token = jwt.sign({ email: data.email, id: user[0].id }, "2347eghdshihf089r4w0aef", { expiresIn: '7d' })
                    res.cookie("x-access-token", token, {
                        maxAge: 60 * 60 * 25 * 30,
                        httpOnly: true
                    })
                    res.redirect("/homePage")
                })
            }
        })


    } catch (error) {
    }


}