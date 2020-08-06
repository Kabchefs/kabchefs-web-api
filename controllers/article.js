const Article = require('../models/articleModel');



exports.createArticle = async(req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        const userId = user._id;
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
            userId: userId
        });
        await newArticle.save();
        res.json({ data: newArticle });

    } catch (error) {
        next(error)
    }
}

exports.getArticles = async(req, res, next) => {
    const articles = await Article.find({ flag: true });
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
        await Article.findByIdAndUpdate(articleId, update);
        const article = await Article.findById(articleId)
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

exports.getPostedArticles = async(req, res, next) => {
    const articles = await Article.find({ flag: false });
    res.status(200).json({
        data: articles
    });
}

exports.getPostedArticle = async(req, res, next) => {
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

exports.approvePostedArticle = async(req, res, next) => {
    try {
        const articleId = req.params.articleId;
        const article = await Article.findById(articleId);
        article.flag = true;
        await Article.findByIdAndUpdate(articleId, article);
        const newArticle = await Article.findById(articleId)
        res.status(200).json({
            data: newArticle,
            message: 'Article has been updated has been updated'
        });
    } catch (error) {
        next(error)
    }
}