const config = require('../config.json');
const mongoose = require('mongoose');
const conn= mongoose.connect('mongodb+srv://namrata:Swapnac123@cluster0-jvvsr.mongodb.net/faith?retryWrites=true' || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
module.exports = {
   // Admin: require('../models/admin'),

    User: require('../users/users.model')
};