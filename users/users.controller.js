const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const User = require('./users.model');
const Customer = require('../models/customer');
const Admin = require('../models/admin');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');

// routes
router.post('/authenticate', authenticate); //public route
router.post('/register', register); //public route

//router.get('/', getAll);   // for admin only
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:id', getById);       // all authenticated users
router.post('/user/:email',  getByEmail);       // public routes

router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/rows/count', countRows); // admin only
router.get('/customers', getAllCustomers);
module.exports = router;


function authenticate(req, res, next) {
    console.log(req.body);

    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({
            message: 'Username or password is incorrect'
            
        }))
        .catch(err => next(err));
        //console.log(err)
}
function getByEmail(req, res, next) {
    console.log('controller ',req.params.email);

    userService.getByEmail(req.params.email)
        .then(user => user ? res.json(user) : res.status(400).json({
            message: 'Email is incorrect'
            
        }))
        .catch(err => next(err));
       
}
function getById(req, res, next) {
    const id = parseInt(req.params.id);

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));

}


function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));

}



function countRows(req, res, next) {
    userService.indexCount()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const id = parseInt(req.params.id);

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function countRows(req, res, next) {
    userService.indexCount()
        .then(() => res.json({}))
        .catch(err => next(err));
}
function getAllCustomers (req, res)  {
    Customer.find({}, (error, customers) => {
      if (error) {
        alert(error);
        res.json({
            
          message: "Server error, Please try after some time.",
          status: 500
          
        });
      }
      if (customers) {
        alert(customers);
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