require('dotenv').config();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles')

// async function hashPassword(password) {
//     return await bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (!err) {
//             return hashedPassword;
//         }
//     });
// }

async function hashPassword(password) {
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword
}


function validatePassword(plainPassword, hashedPassword) {

    return bcrypt.compare(plainPassword, hashedPassword, (err, match) => {
        // console.log(match);
        return match
    });
}

exports.signup = async(req, res, next) => {
    try {
        // const current_role = res.locals.loggedInUser.role;
        // if (current_role !== 'admin') return next(new Error('you cant sign up because you are not admin'));

        const { email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role || "public" });

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1800s"
        });
        //jwt.sign creates the JsonWebToken as a string and return it
        //jwt.sign function takes the payload, secret and options as its arguments. 
        //The payload can be used to find out which user is the owner of the token.
        // Options can have an expire time until which token is valid. The generated token will be a string.
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
                data: newUser,
                accessToken,
                message: "user is successfully signed up"
            })
            //res.json() Sends a JSON response composed of the specified data When an object or array is passed to it, this method is identical to res.send()
            //This method is terminal, meaning that it is generally the last line of code your app should run for a given request (hence the advisory usage of return throughout these docs).
    } catch (error) {
        next(error)
    }
}


exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = validatePassword(password, user.password);
        // console.log(validPassword);
        if (validPassword === false) return next(new Error('Password is not correct'))
        if (user.role === 'public') return next(new Error('You cant login you are not team Member or admin'));
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1800s"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
            data: { email: user.email, role: user.role },
            accessToken
        })
    } catch (error) {
        next(error);
    }
}


exports.getUsers = async(req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        data: users
    });
}

exports.getUser = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return next(new Error('User does not exist'));
        res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error)
    }
}

exports.updateUser = async(req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}

exports.grantAccess = function(action, resource) {
        return async(req, res, next) => {
            try {
                // console.log(res.locals);
                // console.log(req.body);
                const permission = roles.can(req.body.role)[action](resource);
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "You don't have enough permission to perform this action"
                    });
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }
    // to understand the above functionality
    //const ac = new AccessControl();
    //       ac.grant('user')                    // define new or modify existing role. also takes an array.
    //           .createOwn('video')             // equivalent to .createOwn('video', ['*'])
    //           .deleteOwn('video')
    //           .readAny('video')

//           .grant('admin')                   // switch to another role without breaking the chain
//              .extend('user')                 // inherit role capabilities. also takes an array
//              .updateAny('video', ['title'])  // explicitly defined attributes
//              .deleteAny('video');

// const permission = ac.can('user').createOwn('video');
// console.log(permission.granted);    // —> true
// console.log(permission.attributes); // —> ['*'] (all attributes)

// permission = ac.can('admin').updateAny('video');
// console.log(permission.granted);    // —> true
// console.log(permission.attributes); // —> ['title']

exports.allowIfLoggedin = async(req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}