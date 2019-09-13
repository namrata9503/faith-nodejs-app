const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');

const schema = new  mongoose.Schema({
    email: { type: String},
    address:{type: String},
    phone:{type: String},

    name: { type: String},
    messagee:{ type: String },
    createdDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('contactCustomer', schema);
