const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create User Schema
const schema = new Schema ({
    
    name : {
        type : String,
        required : true
    },
    email : { 
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    message: {
        type : String,
        required : true
    }
});

module.exports  = mongoose.model('feedback', schema);