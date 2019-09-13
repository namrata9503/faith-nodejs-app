const Customer = require('../models/customer');
const Contacts = require('../models/contactCutomer');
const Offer = require('../models/offer');
const User = require('../users/users.model');
const Admin = require('../models/admin');

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
const crypto = require('crypto');

function createJwtToken(user) {
  var payload = {
    user: user._id,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, config.tokenSecret);
}
exports.registerUser = (req, res, next) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    name: req.body.name,

  });
  user.save(function (err) {
    console.log(user)
    console.log(err)

    if (err) return next({
      message: "user registeration failed",
      error: err
    });
    res.json({
      message: "user registration successfully",
      status: 200
    });
  });
};
exports.getCurrentUser = (req, res, next) => {
  res.json({
    user: req.user
  })
}
exports.regAdmin = (req, res, next) => {
  var admin = new Admin({
    username: req.body.username,
    password: req.body.password

  });
  admin.save(function (err) {
    console.log(admin)
    console.log(err)

    if (err) return next({
      message: "admin registeration failed",
      error: err
    });
    res.json({
      message: "admin registration successfully",
      status: 200
    });
  });
};
exports.getAdmin = (req, res) => {
  Admin.find({}, (error, admin) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (admin) {
      res.json({
        data: admin,
        message: "All admin fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};

//login

exports.userLogin = (req, res, next) => {
  console.log(req.body)
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    //console.log(err)
    if (!user) return res.json({
      status: 401,
      message: 'User does not exist'
    });
    user.comparePassword(req.body.password, function (err, isMatch) {
      console.log(err)
      if (!isMatch) return res.json({
        status: 401,
        message: 'Invalid email and/or password'
      });
      var token = createJwtToken(user);
      console.log(user)
      res.json({
        message: "User successfully logged in.",
        status: 200,
        token: token
      });
    });
  });
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, config.tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      console.log(token)
      return res.send(500, 'Error parsing token');
    }
  } else {
    return res.send(401);
  }
};
exports.getAllRegisteredUsers = (req, res) => {
  User.find({}, (error, registeredUsers) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (registeredUsers) {
      res.json({
        data: registeredUsers,
        message: "All registeredUsers fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};
exports.getAllUsers = (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (users) {
      res.json({
        data: users,
        message: "All users fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, users) => {
    if (err) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (users) {
      res.json({
        data: users,
        message: "User data fetched successfully",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};
exports.postCust = (req, res) => {
  let {
    name,
    email,
    address,
    phone,
    createdDate,
    city,
    price,
    baths,
    bedrooms,
    share,
    live_tour,
    zip,
    state

  } = req.body;

  var cust = new Customer({
    name,

    email,
    address,
    phone,
    createdDate,
    city,
    price,
    baths,
    bedrooms,
    share,
    live_tour,
    zip,
    state
  });
  cust.save().then((cust) => {
    console.log('Added successfully');
    res.json(cust);
  })
};

exports.custSignUp = (req, res, next) => {
  var cust = new Customer({
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    city: req.body.city,
    price: req.body.price,
    baths: req.body.baths,

    bedrooms: req.body.bedrooms,
    share: req.body.share,
    live_tour: req.body.live_tour,
    zip: req.body.zip,
    state: req.body.state,
  });
  cust.save(function (err) {
    console.log(cust)
    console.log(err)

    if (err) return next({
      message: "customer registeration failed",
      error: err
    });
    res.json({
      message: "cust registered successfully",
      status: 200
    });
  });
};

exports.getAllCustomers = (req, res) => {
  Customer.find({}, (error, customers) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (customers) {
      res.json({
        data: customers,
        message: "All customers fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};

exports.feedbackAdded = (req, res, next) => {
  var cont = new Contacts({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    messagee: req.body.messagee
  });
  cont.save(function (err) {
    console.log(cont)
    console.log(err)

    if (err) return next({
      message: "feedback added failed",
      error: err
    });
    res.json({
      message: "feedback added successfully",
      status: 200
    });
  });
};

exports.getAllCustomersFeedbacks = (req, res) => {
  Contacts.find({}, (error, cont) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (cont) {
      res.json({
        data: cont,
        message: "All feedbacks fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};

//offers

exports.offersCust = (req, res, next) => {
  var offer = new Offer({
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    address: req.body.address
  });
  offer.save(function (err) {
    console.log(offer)
    console.log(err)

    if (err) return next({
      message: "offer added failed",
      error: err
    });
    res.json({
      message: "offer added successfully",
      status: 200
    });
  });
};

exports.getAllCustOffers = (req, res) => {
  Offer.find({}, (error, offer) => {
    if (error) {
      res.json({
        message: "Server error, Please try after some time.",
        status: 500
      });
    }
    if (offer) {
      res.json({
        data: offer,
        message: "All feedbacks fetched",
        status: 200
      });
    } else {
      res.json({
        message: "No data found",
        status: 200
      });
    }
  });
};