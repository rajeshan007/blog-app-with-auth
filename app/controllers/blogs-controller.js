const Blog = require("../models/blog-model")
const User = require('../models/user-model')
const _ = require("lodash")
const blogsCtlr = {}

blogsCtlr.create = async (req, res) => {
    const body = _.pick(req.body, ["title", "content"])
    try {
        const blog = new Blog(body)
        blog.author = req.user.id
        await blog.save()
        /* adding blogs to the user */
        //  const user = await User.findById(blog.author)
        //  user.createdBlogs.push(blog._id)
        //  await user.save()
        // or instead of using above 3 lines use single line for add an item into an array
        await User.findByIdAndUpdate(blog.author, { $push: { createdBlogs: blog._id } })
        res.json(blog)
    } catch (e) {
        res.json(e)
    }
}

blogsCtlr.update = async (req, res) => {
    const id = req.params.id
    const body = req.body
    //const obj = {...body , lastEditedBy : req.user.id}
    try {
        if (req.user.role == "author") {
            // here if author can update only his blog thays why we use _id: id and author : req.user.role
            const blog = await Blog.findOneAndUpdate({ _id: id, author: req.user.id }, body, { new: true })
            res.json(blog)
        } else if (req.user.role == "admin") {
            // here admin can update anybodys blog thatsehy we use id and body
            const blog = await Blog.findByIdAndUpdate(id, body, { new: true })
            res.json(blog)
        }
    } catch (e) {
        res.json(e)
    }
}

blogsCtlr.delete = async (req, res) => {
    const id = req.params.id
    try {
        if (req.user.role == "author") {
            const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.id }, { new: true })
            // const user = await User.findById(blog.author)
            // const index = user.createdBlogs.findIndex(ele => String(ele) == String(blog._id))
            // if (index >= 0) {
            //     user.createdBlogs.splice(index, 1)
            //     await user.save()
            // }
            await User.findByIdAndUpdate(blog.author, { $pull: { createdBlogs: blog._id } })
            res.json(blog)
        } else if (req.user.role == "admin") {
            // here admin can update anybodys blog thatsehy we use id and body
            const blog = await Blog.findByIdAndDelete(id)
            res.json(blog)
        }
    } catch (e) {
        res.json(e)
    }
}

blogsCtlr.list = async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.json(blogs)
    } catch (e) {
        res.json(e)
    }
}


blogsCtlr.pendingBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'pending' })
        res.json(blogs)
    } catch (e) {
        res.json(e)
    }
}
blogsCtlr.approvedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: "approved" })
        res.json(blogs)
    } catch (e) {
        res.json(e)
    }

}

blogsCtlr.changeStatus = async (req, res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['status'])
    try {
        const blogs = await Blog.findByIdAndUpdate(id, body, { new: true })
        res.json(blogs)
    } catch (e) {
        res.json(e)
    }
}

module.exports = blogsCtlr