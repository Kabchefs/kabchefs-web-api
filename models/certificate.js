const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const certificateSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    certiNumber: {
        type: Number
    }

});

// this is mongoose-sequence plugin  we have to add to automatically increasing the certiNumber field
certificateSchema.plugin(AutoIncrement, { id: 'certiNumber_seq', inc_field: 'certiNumber' });

exports.Certificate = new Mongoose.model('Certificate', certificateSchema);