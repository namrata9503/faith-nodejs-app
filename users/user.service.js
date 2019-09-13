const config = require('../config.json');
const con = require('../con.json');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Admin = db.Admin;
const Role = require('../_helpers/role');

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
    indexCount
};

async function authenticate({
    username,
    password
}) {
    const user = await User.findOne({
        username
    });
    console.log(user.hash);
    if (user && bcrypt.compareSync(password, user.hash)) {
        const {
            hash,
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
    return await User.find({role:"User"}).select('-hash');
}
async function indexCount() {

    User.count({},function(err,count){
       console.log("Number of rows in users : "+count);
   });
  // return await User.find({}).countDocuments().select('-hash');
//    User.count({},function(err, count) { 


//    if (err) {

//                 console.log("Number of err:", err);
    
//                 res.json({
    
//                     status: "error",
//                     message: err,
    
//                 });
//             }
//             console.log("Number of users:", count);
//             res.json({
//                 status: "success",
//                 message: "Count info retrieved successfully",
//                 data: count,
//             });


//         } )
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


// function indexCount() {
   
// };

// async function indexCount() {
//     //return await User.countDocuments({}).select('-hash');

//     User.estimatedDocumentCount({}, function (err, count) {
//         if (err) {

//             console.log("Number of err:", err);

//             res.json({

//                 status: "error",
//                 message: err,

//             });
//         }
//         console.log("Number of users:", count);
//         res.json({
//             status: "success",
//             message: "Count info retrieved successfully",
//             data: count,
//         });

//     })

// }