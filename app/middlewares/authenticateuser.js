const jwt = require("jsonwebtoken")
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: tokenData.id,
            role: tokenData.role,
        }
        next()
    } catch (e) {
        res.status(401).json(e)
    }
}

// const authorizeuser = (req, res, next) => {
//     if (req.permittedRoles.includes(req.user.role)) {
//         next()
//     } else {
//         res.status(403).json({ message: "sorry you have not able to acces this route" })
//     }
// }

const authorizeuser = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({ message: "sorry you are not able access to  this route" })
        }
    }
}

module.exports = {
    authenticateUser,
    authorizeuser
   
}
