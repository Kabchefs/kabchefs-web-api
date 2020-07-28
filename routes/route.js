// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/article/:articleId', userController.allowIfLoggedin, articleController.getArticle);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/articles', userController.grantAccess('readAny', 'article'), articleController.getArticles);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.put('/article/:articleId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'article'), articleController.updateArticle);


router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.delete('/article/:articleId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'article'), articleController.deleteArticle);

router.post('/article', userController.allowIfLoggedin, userController.grantAccess('createAny', 'article'), articleController.createArticle);

module.exports = router;