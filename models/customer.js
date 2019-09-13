const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');

const schema = new  mongoose.Schema({
    email: { type: String},
    address:{type: String},
    phone:{type: String},

    name: { type: String},
    city: { type: String},
    price: { type: Number},
    state: { type: String},
    zip: { type: Number},
    bedrooms: { type: Number},
    baths: { type: Number},
    bedrooms: { type: Number},
    live_tour: { type: Boolean},
    share: { type: String},
    createdDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Customer', schema);
