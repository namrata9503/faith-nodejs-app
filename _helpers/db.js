const config = require('../config.json');
require('dotenv').config()

const mongoose = require('mongoose');
const conn= mongoose.connect(process.env.DB_CONNECTION || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
module.exports = {
   // Admin: require('../models/admin'),

    User: require('../users/users.model')
};