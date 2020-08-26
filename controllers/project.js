const Project = require('../models/project');
const shortid = require('shortid');

exports.getProjects = (req, res, next) => {
    Project.find({}, (err, foundProjects) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: foundProjects
            })
        }
    })

}

exports.getProject = (req, res, next) => {

    Project.findOne({ projectId: req.params.projectId }, (err, foundProject) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: foundProject
            })
        }
    })

}

exports.postProject = (req, res, next) => {


    try {
        let file = req.file;
        if (!file) {
            res.status(400);
            res.json('file not found');
            return;
        }
        let extname = file.originalname.split('.')[1];
        const image = shortid() + "." + extname;

        const { title, description, link, status } = req.body;
        const newProject = new Project({ title, description, link, image: image, status })
        newProject.save((err, savedProject) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json({
                    data: savedProject,
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




exports.updateProject = async(req, res, next) => {
    try {
        let file = req.file;
        if (!file) {
            res.status(400);
            res.json('file not found');
            return;
        }
        let extname = file.originalname.split('.')[1];
        req.body.image = shortid() + "." + extname;
        const update = JSON.parse(JSON.stringify(req.body));
        const projectId = req.params.projectId;
        await Project.findByIdAndUpdate(projectId, update);
        const project = await User.findById(projectId)
        res.status(200).json({
            data: project,
            message: 'Project has been updated'
        });

        //below code will update the file to firebase
        let fileUpload = req.bucket.file(req.body.image);
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

exports.deleteProject = (req, res, next) => {


    Project.delete({ projectId: req.params.projectId }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: null,
                message: "project is deleted successfully"
            })
        }
    });

}