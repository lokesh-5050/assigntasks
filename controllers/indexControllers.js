const connection = require("../database/config");

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
    let sql = `Delete From Users Where id=${userId}`;
    connection.query(sql, (err, row) => {
        if (err) throw err;
        console.log(row, "deleted");
        res.redirect("/")
    })
}

exports.handleAddUserPage = async (req, res, next) => {
    res.render('addUser')
}

exports.handleAddUser = async (req, res, next) => {
    let data = { name: req.body.name, email: req.body.email, mobile: req.body.mobile, password: req.body.password }
    try {
        let checkQ = `Select *from users where name="${data.name}" AND email="${data.email}" `
        let userExist = await connection.query(checkQ, (err, row) => {
            if (err) throw err;
            if(!row){
                
            }
        })
        console.log(userExist , " millaa");
    } catch (error) {
        console.log(error);
    }

}