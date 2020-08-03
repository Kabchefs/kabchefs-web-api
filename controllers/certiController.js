require('dotenv').config();
const Certificate = require('../models/modal_schema');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles');


exports.getCertificates = (req, res, next) => {
    Certificate.find({}, (err, foundCerties) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: foundCerties
            })
        }
    });

}

exports.getCertificate = (req, res, next) => {
    Certificate.findOne({ certiId: req.params.certiId }, (err, foundCerti) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: foundCerti
            })
        }
    })

}

exports.postCertificate = (req, res, next) => {


}