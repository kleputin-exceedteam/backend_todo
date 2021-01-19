const ObjectId = require('mongodb').ObjectID;

const { TaskModel } = require("../models");

exports.get = (req, res) => {
    TaskModel.find()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                code: 500,
                error: err
            })
        })
};

exports.delete = (req, res) => {
    if (!req.params.id){
        return res.status(400).json({
            code: 400,
            error: 'No id in request'
        })
    }
        if (!ObjectId.isValid(req.params.id)){
            return res.status(400).json({
                code: 400,
                error: "Invalid id"
            })
        }
        TaskModel.findByIdAndDelete(new ObjectId(req.params.id))
            .then( data => {
                res.status(200).json({
                    code: 200,
                    delItem: data
                });
            })
            .catch(err => {
                res.status(500).json({
                    code: 500,
                    error: err
                })
            })
    }


exports.addItem =  (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            code: 400,
            error: 'No name in request'
        })
    }
    if (name.length === 0){
            return res.status(400).json({
                code: 400,
                error: "Invalid name"
            });
    }
        TaskModel.exists({name}).then(is_exsist => {
            if (is_exsist){
                return res.status(208).json({code: 208});
            }
            TaskModel.create({name, is_active: true})
                .then(data => {
                    res.status(201).json({
                        code: 201,
                        _id: data._id
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        code: 500,
                        error: err
                    })
                })
        })
            .catch(err => {
                res.status(500).json({
                    code: 500,
                    error: err
                })
            })
};

exports.deleteComp = (req, res) => {
    TaskModel.deleteMany({is_active: false})
        .then(() => {
            res.status(200).json({
                code: 200
            })
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                error: err
            })
        })
};

exports.changeStatus = (req, res) => {
    const { status, id } = req.body;
    if (status == null || !id){
        return res.status(400).json({
            code: 400,
            error: 'No new status or id'
        })
    }
    if (!ObjectId.isValid(id) || typeof(status) !== "boolean"){
        return res.status(400).json({
            code: 400,
            error: "Invalid request"
        })
    }
    TaskModel.findByIdAndUpdate(id, {$set: {is_active: status}})
        .then((result) => {
            if (!result) {
                throw result;
            }
            res.status(202).json({
                code: 202
            })
        })
        .catch(() => {
            res.status(500).json({
                code: 500,
                error: "Not found"
            })
        })
};

exports.changeAll = (req, res) => {
    const { all_comp } = req.body;
    if (all_comp == null){
        return res.status(400).json({
            code: 400,
            error: 'No boolean state in request'
        })
    }
    if (typeof(all_comp) !== "boolean"){
        return res.status(400).json({
            code: 400
        })
    }
    TaskModel.updateMany({is_active: !all_comp}, {$set: {is_active: all_comp}})
        .then((result) => {
            if (!result) {
                throw result;
            }
            res.status(200).json({code: 200});
        })
        .catch(() => {
            res.status(500).json({code: 500});
        })
};

exports.changeName = (req, res) => {
    const { id, name } = req.body;
    if (!id || !name){
        return res.status(400).json({
            code: 400,
            error: 'No new name or id in request'
        })
    }
    if (!ObjectId.isValid(id) || !(name.length > 0)){
        return res.status(400).json({
            code: 400,
            error: 'Invalid id'
        });
    }
    TaskModel.exists({name}).then(is_exists => {
        if (is_exists){
            return res.status(208).json({code: 208});
        }
        TaskModel.findByIdAndUpdate(new ObjectId(id), {$set: {name}})
            .then(result => {
                res.status(200).json({code: 200});
            })
            .catch(() => {
                res.status(500).json({code: 500});
            })
    })
};
