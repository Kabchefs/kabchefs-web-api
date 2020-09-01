// server/routes/route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const articleController = require('../controllers/article');


router.get('/:articleId', articleController.getArticle);

router.get('/', articleController.getArticles);


router.put('/:articleId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'article'), articleController.updateArticle);


router.delete('/:articleId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'article'), articleController.deleteArticle);

router.post('/', userController.allowIfLoggedin, userController.grantAccess('createAny', 'article'), articleController.createArticle);

router.get('/posted', userController.allowIfLoggedin, userController.grantAccess('readAny', 'article'), articleController.getPostedArticles);

router.get('/posted/:articleId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'article'), articleController.getPostedArticle);

router.delete('/posted/:articleId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'article'), articleController.deleteArticle);

module.exports = router;