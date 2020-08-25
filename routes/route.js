const express = require('express');
const router = express.Router();
const userRoute = require('./article');
const certificateRoute = require('./certificate');
const articleRoute = require('./article');
const projectRoute = require('./project');
const submit_projectRoute = require('./submit_project');
const userController = require('../controllers/user');

router.post('/login', userController.login);

router.post('/signup', userController.grantAccess('createAny', 'user'), userController.signup);

router.use('./users', userRoute);
router.use('./articles', articleRoute);
router.use('./certificates', certificateRoute);
router.use('./projects', projectRoute);
router.use('./submit_projects', userRoute);

module.exports=router;