// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const articleController = require('../controllers/article');


router.get('/articles/:articleId', articleController.getArticle);

router.get('/articles', articleController.getArticles);


router.put('/articles/:articleId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'article'), articleController.updateArticle);


router.delete('/articles/:articleId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'article'), articleController.deleteArticle);

router.post('/articles', userController.allowIfLoggedin, userController.grantAccess('createAny', 'article'), articleController.createArticle);

router.get('/articles/posted', userController.allowIfLoggedin, userController.grantAccess('readAny', 'article'), articleController.getPostedArticles);

router.get('/articles/posted/:articleId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'article'), articleController.getPostedArticle);

router.delete('/articles/posted/:articleId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'article'), articleController.deleteArticle);

module.exports = router;