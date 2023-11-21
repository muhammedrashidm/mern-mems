import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    message:{
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: String
    },
    selectedFile:String,
    tags:[{}],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }]

}, { timestamps: true })

const PostModal = mongoose.model('Post',postSchema)

export default PostModal