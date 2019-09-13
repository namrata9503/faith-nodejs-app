const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('../_helpers/role');

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String,  required: true },

    hash: { type: String, required: true },
    
    role:{type: String, required:true},
    createdDate: { type: Date, default: Date.now }
});
// const users = [
//     { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
//     { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
// ];
schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Users', schema);