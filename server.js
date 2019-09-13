// require('rootpath')();
const express = require('express');
const app = express();
var path = require('path');

const mongoose = require('mongoose')
, cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const userContoller = require('./users/users.controller');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// Connect to Mongoose and set connection variable

mongoose.connect('mongodb+srv://namrata:Swapnac123@cluster0-jvvsr.mongodb.net/faith?retryWrites=true')
mongoose.connection.on('error', (error) => console.error(error))
mongoose.connection.on('open', () => console.log('successfully connected with mongodb..'))

// use JWT auth to secure the api
app.use(jwt());

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

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8080;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
