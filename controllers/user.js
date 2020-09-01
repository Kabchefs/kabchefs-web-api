const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');
const shortid = require('shortid');



exports.signup = (req, res, next) => {
    try {

        const { email, password, role } = req.body

        bcrypt.hash(password, 10, function(err, hash) {
            if (err) console.log(err);
            else {
                const newUser = new User({ email, password: hash, role: role });

                const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                    expiresIn: "1800s"
                });

                newUser.accessToken = accessToken;
                newUser.save();
                res.json({
                    data: newUser,
                    accessToken,
                    message: "user is successfully signed up"
                })
            }

        });


    } catch (error) {
        next(error)
    }
}


exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(new Error('Email does not exist'));


        bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "1800s"
                    });
                    User.findByIdAndUpdate(user._id, { accessToken })
                    res.status(200).json({
                        data: { email: user.email, role: user.role },
                        accessToken
                    })
                } else {
                    return next(new Error('Password is incorrect'))
                }

            }).catch((err) => {
                console.log(err);
            });




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
        fileUpload.save(Buffer.from(file.buffer)).then(
            result => {
                console.log("file uploaded sucessfully");
            },
            error => {
                res.status(500);
                console.log(error);
                res.json({ error: error });
            }
        ).catch((err) => {
            console.log(err);
        })
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