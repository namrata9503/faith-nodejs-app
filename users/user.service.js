const config = require('../config.json');
const con = require('../con.json');


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
//const User =require( "../users/users.model");

const Role = require('../_helpers/role');
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
// var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
const users =require('../users/users.model');
var result = {};
var async=require('async');
var crypto=require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

var sendgrid = require('sendgrid')('your-sendgrid-username', 'your-sendgrid-password');
const transporter= require('../users/resetModule');
const getPasswordResetURL= require('../users/resetModule');
const resetPasswordTemplate= require('../users/resetModule');

//const users = db.Users;
// const users = [
//     { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
//     { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
// ];
module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    indexCount,
    getForgot,
    usePasswordHashToMakeToken,
    getByEmail
};

var d = new Date();

var calculatedExpiresIn = (((d.getTime()) + (60 * 60 * 1000)) - (d.getTime() - d.getMilliseconds()) / 1000);
// `secret` is passwordHash concatenated with user's createdAt,
// so if someones gets a user token they still need a timestamp to intercept.
 function usePasswordHashToMakeToken  ({
     
    password: passwordHash,
    _id: userId,
    createdDate
  })  {
    const secret = passwordHash + "-" + createdDate
    const token = jwt.sign({ userId }, secret, {
        expiresIn: calculatedExpiresIn  // 1 hour
    })
    return token
  }

  async function getByEmail(req, res) {
      console.log('req ',req)
    const {
      email
    } = req.params;
    console.log("email", email);
     let user;
     console.log("let user", user);
  
    try {
      user = await User.findOne({
        email
        
      }).exec()
      console.log("find user", user.email);
  
    } catch (err) {
      res.status(404).json("No user with that email")
    }
    console.log("after find user", user);
  
    const token = userService.usePasswordHashToMakeToken(user);
    console.log("token user", user);
  
    const url = resetModule.getPasswordResetURL(user, token)
    console.log("geturl user", user);
  
    const emailTemplate = resetModule.resetPasswordTemplate(user, url)
    console.log("token", token);
    console.log("email template user", user);
  
  
    const sendEmail = () => {
    
  
      transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          res.status(500).json("Error sending email")
        }
        res.json(" sent email");
  
        console.log(`** Email sent email message ID  **`, info.messageId)
      })
        
    }
    sendEmail()
  }
  

async function authenticate({
    username,
    password
}) {
    const user = await User.findOne({
        username
    });
    console.log("password authenticate ",user.password);
    console.log("password  ",password);

    if (user && bcrypt.compareSync(password, user.password)) {
        const {
            password,
            ...userWithoutHash
        } = user.toObject();
        const token = jwt.sign({
            sub: user.id,
            role: user.role
        }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    // if(role!=="Admin")
    return await User.find({
        role: "User"
    }).select('-hash');
}


async function getForgot() {
    // if(role!=="Admin")
    return await User.find({
        resetPasswordToken:"456559e1c87f2c7af43327dc309a88aa677f1826"
    }).select('-hash');
}

async function indexCount() {

    User.count({}, function (err, count) {
        console.log("Number of rows in users : " + count);
    });




}

async function getById(id) {
    return await User.findById(id).select('-hash');
}




async function create(userParam) {
    // validate
    if (await User.findOne({
            username: userParam.username
        })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}




async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({
            username: userParam.username
        })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

    