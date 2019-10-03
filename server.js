// require('rootpath')();
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

var path = require('path');

const mongoose = require('mongoose'),
  cors = require('cors');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const userContoller = require('./users/users.controller');
var session = require('express-session')
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
const db = require('./_helpers/db');
var xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');
const userService = require('./users/user.service');
const resetModule = require('./users/resetModule');
//const User =require( "./users/users.model");
const jwtDecode = require('jwt-decode');
 const User = db.User;
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
//require('dotenv').config({path : './.env'});
require('dotenv').config()
console.log('env ',process.env.EMAIL)
console.log('config env ',require('dotenv').config())

//require('dotenv/config')
//require('./users/resetModule')
//const log = console.log;
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.get('origin'));
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());


// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon());
// app.use(logger('dev'));

//app.use(cookieParser());
app.use(session({
  secret: 'session secret key'
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// parse application/json


// Connect to Mongoose and set connection variable

mongoose.connect(process.env.DB_CONNECTION)
mongoose.connection.on('error', (error) => console.error(error))
mongoose.connection.on('open', () => console.log('successfully connected with mongodb..'))

// use JWT auth to secure the api
app.use(jwt());


// app.get('/', function () {
//   res.render('index', {
//     option: 'value'
//   });
// });


//local strategy

passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({
    username: username
  }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {
      message: 'Incorrect username.'
    });
    user.comparePassword(password, function (err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    });
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


app.post('/user/:email', async function sendPasswordResetEmail(req, res) {
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
})


app.post('/new/:userId/:token',  receiveNewPassword = (req, res) => {
  const { userId, token } = req.params
  console.log("1",userId);
  const { password } = req.body
  console.log("password body ",password);
  console.log("body ",req.body);


  // highlight-start
  User.findOne({ _id: userId })
    .then(user => {
      const secret = user.password + "-" + user.createdDate
      console.log("_id ",userId)
      console.log("secret ",secret)
      console.log("pwd ",user.password)

      const payload = jwtDecode(token, secret)
      console.log("paylod ", payload.iat);

      if (payload.userId === user.id) {
        bcrypt.genSalt(10, function(err, salt) {
         // console.log("secret2 ",secret)
          console.log("salt ",salt)

          // Call error-handling middleware:
          if (err) return
        //  console.log("error bcrypt ",err)

          bcrypt.hash(password, salt,null, function(err, hash) {
            // Call error-handling middleware:
            if (err) return
            console.log("error salt ",err)

            User.findOneAndUpdate({ _id: userId }, { password: hash })
              .then(() => res.status(202).json("Password changed accepted"))
              .catch(err => res.status(500).json(err))
              console.log("id ",userId);
              console.log("password ",password)


          })
        })
      }
    })
    // highlight-end
    .catch(() => {
      res.status(404).json("Invalid user");
     console.log("error")
    })
})

// api routes
// const userContoller = require('./controllers/Customer');

app.use('/users', require('./users/users.controller'));
// app.get('/:id', userContoller.getById);

//admin
const admin = require('./controllers/Customer');
//app.post('/admin', admin.regAdmin);

//app.get('/admin', admin.getAdmin);


//customers
const custContoller = require('./controllers/Customer');

app.post('/api/v1/cust', custContoller.postCust);
app.post('/api/v1/customer', custContoller.custSignUp);

app.get('/customers', custContoller.getAllCustomers);

//feedbacks by customer and their details
const contContoller = require('./controllers/Customer');

app.post('/api/v1/contact', contContoller.feedbackAdded);

app.get('/api/v1/contacts', contContoller.getAllCustomersFeedbacks);

//feedbacks by customer and their details
const offerContoller = require('./controllers/Customer');

app.post('/api/v1/offer', offerContoller.offersCust);

app.get('/offerCust', offerContoller.getAllCustOffers);

// global error handler
app.use(errorHandler);

