const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "ongoing",
        enum: ["ongoing", "completed", "coming"]
    }

});

const Project = new mongoose.model('Project', projectSchema);
module.exports = Project;