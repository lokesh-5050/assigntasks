const jwt = require('jsonwebtoken')

exports.authenticateLogin = async (req, res, next) => {
    const token = req.cookies["x-access-token"];

    if (!token) {
        res.render("errorPage" , {msg:"Tokne Expired"})
    }

    try {

        const validToken = await jwt.verify(token, "2347eghdshihf089r4w0aef")
        
        if (validToken) {
            req.authenticated = true;
            return next();
        }

    } catch (error) {
    }
}