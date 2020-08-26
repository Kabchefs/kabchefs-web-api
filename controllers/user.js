const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');
const shortid = require('shortid');

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
        return match
    });
}

exports.signup = async(req, res, next) => {
    try {

        const { email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ email, password: hashedPassword, role: role });

        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1800s"
        });

        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
            data: newUser,
            accessToken,
            message: "user is successfully signed up"
        })

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
        let file = req.file;
        if (!file) {
            res.status(400);
            res.json('file not found');
            return;
        }
        let extname = file.originalname.split('.')[1];
        req.body.image = shortid() + "." + extname;
        const update = JSON.parse(JSON.stringify(req.body));
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        const user = await User.findById(userId)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });

        //below code will upload the file to firebase
        let fileUpload = req.bucket.file(req.body.image);
        fileUpload.save(new Buffer(file.buffer)).then(
            result => {
                console.log("file uploaded sucessfully");
            },
            error => {
                res.status(500);
                console.log(error);
                res.json({ error: error });
            }
        );
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
            const permission = roles.can(req.body.role)[action](resource);
            //  roles.can(admin)(readAny)(article)
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