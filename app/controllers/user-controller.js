const User = require("../models/user-model")
const _ = require("lodash")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const usersCtlr = {}

usersCtlr.signup = async (req, res) => {
    const body = req.body
    // sanitize input 
    if (body.role == "admin") {
        body.role = "user"
    }
    try {
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        user.password = await bcryptjs.hash(body.password, salt)
        // assign first user in the app as admin 
        const totalUsers = await User.countDocuments()
        if (totalUsers == 0) {
            user.role = "admin"
        }
        await user.save()
    } catch (e) {
        res.json(e)
    }
}

usersCtlr.login = async (req, res) => {
    const body = req.body
    try {
        const user = await User.findOne({ email: body.email })
        if (!user) {
            res.status(404).json({ errors: "invalid email / password" })
        } else {
            const result = await bcryptjs.compare(body.password, user.password)
            if (!result) {
                res.status(404).json({ errors: "invalid email / password" })
            } else {
                const tokenData = { id: user._id, role: user.role }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' })
                res.json({ token: token })
            }
        }
    } catch (e) {
        res.json(e)
    }

}
// to find logged in  user profile
usersCtlr.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            res.json({ message: "user profile was not found" })
        } else {
            res.json(user)
        }

    } catch (e) {
        res.json(e)
    }
}

// to find all the users 
usersCtlr.list = async (req,res) => {
    try { 
        const users = await User.find()
        res.json(users)
    }catch(e) {
        res.json(e)
    }
}

//  only the admin  can change the user roles 
usersCtlr.changeRole = async (req, res) => {
    const id = req.params.id
    const body = req.body
    // if the admin can change their own role 
    // if(id == req.user.id) {
    //     return res.status(400).json({error : "operation cannot be performed"})
    // }
    try {
        const user = await User.findByIdAndUpdate(id, body, { new: true })
        res.json(user)
    } catch (e) {
        res.json(e)
    }
}


// admin  to delete the user account
usersCtlr.delete = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.json({ message: " sorry!!! user is already deleted" })
        } else {
            res.json(user)
        }

    } catch (e) {
        res.json(e)
    }
}

module.exports = usersCtlr 