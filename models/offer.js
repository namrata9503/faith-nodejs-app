const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    city: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },

    name: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('offer', schema);