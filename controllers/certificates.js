const Certificate = require('../models/certificate');
const shortid = require('shortid');


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

    try {
        let file = req.file;
        if (!file) {
            res.status(400);
            res.json('file not found');
            return;
        }
        let extname = file.originalname.split('.')[1];
        const image = shortid() + "." + extname;

        const newCertificate = new Certtificate({
            certiId: shortid(),
            image: image
        })
        newCertificate.save((err, savedCerti) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json({
                    data: savedCerti,
                    message: 'certificate has been created'
                });
            }
        })


        //below code will update the file to firebase
        let fileUpload = req.bucket.file(image);
        fileUpload.save(new Buffer(file.buffer)).then(
            result => {
                console.log("file uploaded sucessfully");
            },
            error => {
                res.status(500);
                console.log(error);
                res.json({ error: error });
            }
        );
    } catch (error) {
        next(error)
    }


}