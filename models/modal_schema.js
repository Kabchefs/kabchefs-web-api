const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'public',
        enum: ["public", "teamMember", "admin"]
    },
    accessToken: {
        type: String
    },
    imageUrl: {
        type: String
    }
});

exports.User = mongoose.model('user', UserSchema);


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

exports.Article = new mongoose.model('Article', articleSchema);

// when you will save certies then you dont need to provide certiNumber because it will be add automatically

const certificateSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    certiNumber: {
        type: Number
    }

});

// this is mongoose-sequence we have to add to automatically increasing the certiNumber field
certificateSchema.plugin(AutoIncrement, { id: 'certiNumber_seq', inc_field: 'certiNumber' });

exports.Certificate = new Mongoose.model('Certificate', certificateSchema);

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
    imageUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "ongoing",
        enum: ["ongoing", "completed", "coming"]
    }

});

exports.Project = new mongoose.model('Project', projectSchema);

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