const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const submitProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 10
    }

})

exports.SubmitProject = new mongoose.model('SubmitProject', submitProjectSchema);