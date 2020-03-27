const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Order Schema
const schema = new Schema ({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    cart: { type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    zipcode:{type: Number, required: true},
    phno: {type: String, required: true},
    alphno:{type: String, required: true}
});

module.exports = mongoose.model('Order', schema);