const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    flag: {
        type: Boolean,
        default: false
    }
});

const Article = new mongoose.model('Article', articleSchema);
module.exports = Article;