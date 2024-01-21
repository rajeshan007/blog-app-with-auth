require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 3030

const configureDB = require('./config/db')
const routes = require('./config/routes')
configureDB()
app.use(express.json())
app.use(cors())
app.use('/', routes)


const usersCtlr = require("./app/controllers/user-controller")
const blogsCtlr = require("./app/controllers/blogs-controller")
const commentsCtlr = require('./app/controllers/comments-controller')
const { authenticateUser, authorizeuser, } = require('./app/middlewares/authenticateuser')

app.post("/api/users/signup", usersCtlr.signup)
app.post("/api/users/login", usersCtlr.login)
app.get("/api/users/profile", authenticateUser, usersCtlr.getProfile)

// for only admin or author can see the users list
// app.get("/api/users/list", authenticateUser, (req, res, next) => {
//     req.permittedRoles = ["admin", "author"]
//     next()
// }, authorizeuser, usersCtlr.list)
app.get('/api/users/list', authenticateUser, authorizeuser(['admin']), usersCtlr.list)
app.put("/api/users/:id/chnage-role", authenticateUser, authorizeuser(["admin"]), usersCtlr.changeRole)
app.delete('/api/users/:id/delete', authenticateUser, authorizeuser(["admin"]), usersCtlr.delete)


// app.get("/api/blogs", blogsCtlr.list)
app.post('/api/blogs/create', authenticateUser, authorizeuser(["author"]), blogsCtlr.create)
app.get("/api/blogs/pending-blogs", authenticateUser, authorizeuser(['moderator']), blogsCtlr.pendingBlogs)
app.get("/api/blogs/approved-blogs", authenticateUser, authorizeuser(['moderator']), blogsCtlr.approvedBlogs)
app.put("/api/blogs/:id", authenticateUser, authorizeuser(["admin", "author"]), blogsCtlr.update)
app.put('/api/blogs/:id/change-status', authenticateUser, authorizeuser(['moderator']), blogsCtlr.changeStatus)
app.delete("/api/blogs/:id", authenticateUser, authorizeuser(["admin", "author"]), blogsCtlr.delete)
app.get('/api/blogs/list', authenticateUser, authorizeuser(['moderator']), blogsCtlr.list)



app.get('/api/comments', authenticateUser, commentsCtlr.list)
//for approve a comment 
app.put('/api/comments/:id/approve',authenticateUser, authorizeuser(['moderator']), commentsCtlr.approve)
app.post('/api/blogs/:bId/create-comments', authenticateUser, commentsCtlr.create)
app.put('/api/blogs/:bId/comments/:cId', authenticateUser, authorizeuser(['moderattor', 'user']))
app.delete('/api/blogs/:bId/comments/:cId', authenticateUser, authorizeuser(['moderator', 'user']))

app.listen(port, () => {
    console.log('server running on port', port)
})
