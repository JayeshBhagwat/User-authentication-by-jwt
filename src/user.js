const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/login_mongo', { useNewUrlParser: true })
const db = mongoose.connection // db connection

const user = mongoose.model('register', {
    role:{
        type: String,
        required : true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    },
    token:{
        type: String
    }
})


module.exports = user 