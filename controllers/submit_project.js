const SubmitProject = require('../models/submit_project');



exports.get_submitProjects = (req, res, next) => {

    SubmitProject.find({}, (err, foundProjects) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: foundProjects
            })
        }
    })
}


exports.post_submitProject = (req, res, next) => {

    const { title, description, email, phoneNumber } = req.body;
    const new_submitProject = new SubmitProject({ title, description, email, phoneNumber });
    new_submitProject.save((err, savedProject) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: savedProject,
                message: "your peoject is submitted successfully"
            });
        }
    });

}

exports.get_submitProject = (req, res, next) => {

    SubmitProject.findOne({ _id: req.params.projectId }, (err, foundProject) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: foundProject
            })
        }
    })
}