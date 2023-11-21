import mongoose from "mongoose";

const userSchema = mongoose.Schema({


    googleId: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username:{
        type: String,
        require: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
    
}, { timestamps: true })

const UserModal = mongoose.model('User', userSchema)

export default UserModal