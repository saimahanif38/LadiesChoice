const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Product Schema
const schema = new Schema ({
    
    imagePath1 : {
        type : String,
        required : true
    },
    imagePath2 : {
        type : String,
        required : true
    },
    title : { 
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    }
});

module.exports = mongoose.model('Product', schema);