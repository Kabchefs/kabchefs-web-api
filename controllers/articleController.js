require('dotenv').config();
const Article = require('../models/articleModel');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles');


exports.createArticle = async(req, res, next) => {
    try {
        const { title, content } = req.body;
        const newArticle = new Article({ title, content });
        await newArticle.save();
        res.json({ data: newArticle });

    } catch (error) {
        next(error)
    }
}
exports.getArticles = async(req, res, next) => {
    const articles = await Article.find({});
    res.status(200).json({
        data: articles
    });
}

exports.getArticle = async(req, res, next) => {
    try {
        const articleId = req.params.articleId;
        const article = await User.findById(articleId);
        if (!article) return next(new Error('Article does not exist'));
        res.status(200).json({
            data: article
        });
    } catch (error) {
        next(error)
    }
}

exports.updateArticle = async(req, res, next) => {
    try {
        const update = req.body
        const articleId = req.params.articleId;
        await User.findByIdAndUpdate(articleId, update);
        const article = await User.findById(articleId)
        res.status(200).json({
            data: article,
            message: 'Article has been updated has been updated'
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteArticle = async(req, res, next) => {
    try {
        const articleId = req.params.articleId;
        await Article.findByIdAndDelete(articleId);
        res.status(200).json({
            data: null,
            message: 'Article has been deleted'
        });
    } catch (error) {
        next(error)
    }
}