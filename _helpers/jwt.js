const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');
const con = require('../con.json');
module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({
        secret,
        isRevoked
    }).unless({
        path: [
            // public routes that don't require authentication
            '/user/',
            '/users/auth/facebook',
            '/users/authenticate',
            '/users/register',
            '/users/user/:email',
            '/users/:email',
            '/user/:email',
            '/api/members/confirm/:id',
            { url: /^\/user\/.*/, methods: ['POST'] },
            '/forgot',
            '/user/forgot',
            { url: /^\/new\/.*/, methods: ['POST'] }

            // '/new/5d88df3736734b12f09970f8/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDg4ZGYzNzM2NzM0YjEyZjA5OTcwZjgiLCJpYXQiOjE1NjkzMjIwNjQsImV4cCI6MTU3MjkyMjA2NH0.7nOS1ovDufkFXPyfiqo-BTlBmJarS6cfO1RsPVU1PZs'

        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};