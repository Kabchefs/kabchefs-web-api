require('dotenv').config();
const Project = require('../models/modal_schema');
const SubmitProject = require('../models/modal_schema');
const jwt = require('jsonwebtoken');
const { roles } = require('../roles');

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
    const { title, description, link, imageUrl, status } = req.body;
    const newProject = new Project({ title, description, link, imageUrl, status });
    newProject.save((err, project) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: project,
                message: "new project is saved"
            });
        }
    })

}

exports.updateProject = (req, res, next) => {

    const update = req.body;

    Project.findOne({ projectId: req.params.projectId }, update, (err, updatedProject) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: updatedProject,
                message: "project is updated successfully"
            })
        }
    })

}

exports.deleteProject = (req, res, next) => {


    Project.delete({ projectId: req.params.projectId }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({
                data: null,
                message: "project id deleted successfully"
            })
        }
    });

}

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

    SubmitProject.findOne({ title: req.params.title }, (err, foundProject) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                data: foundProject
            })
        }
    })
}