const mongoose  = require('mongoose')

const {Schema, model} =  mongoose 

const commentSchema =  new Schema ({
    userId : {
        type : Schema.Types.ObjectId,
        ref  : "User"
    },
    body : {
        type : String
    },
    blogId :{
        type : Schema.Types.ObjectId,
        ref : "Blog"
    },
    status : {
        type : String,
        default :'pending'
    }

})

const Comment  =  model('Comment', commentSchema)

module.exports = Comment