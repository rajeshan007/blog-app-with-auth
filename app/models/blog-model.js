const mongoose = require("mongoose")
const { Schema, model } = mongoose

const blogSchema = new Schema({
    title: String,
    content: String,
    blogUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "reject"],
        default: "pending"
    },
    // lastEditedBy : {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     default: "null"
   // }
}, {timestamps: true})

const Blog = model("Blog", blogSchema)

module.exports = Blog