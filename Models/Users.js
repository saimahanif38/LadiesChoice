const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create User Schema
const UserSchema = new Schema ({
    
    fullName : {
        type : String,
        required : true
    },
    email : { 
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    mobileNo : {
        type : Number,
        required : true
    }
});

module.exports = User = mongoose.model('users', UserSchema);