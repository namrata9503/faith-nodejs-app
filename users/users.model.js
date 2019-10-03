const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('../_helpers/role');
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
const schema = new Schema({
    username: { type: String, unique: true, required: true },
    contact: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String,  required: true },
    password: { type: String, required: true },

    // hash: { type: String, required: true },
    name:{type: String, required:true},
    role:{type: String, required:true},
    createdDate: { type: Date, default: Date.now },
    facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
    token: {
      type: String,
      required: false
    },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

schema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}


schema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;
  
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err) return next(err);
  
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
  
  schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  
schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Users', schema);