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
};

exports.addItem =  (req, res) => {
    if (!req.body.name.length > 0){
        return res.status(400).json({
            code: 400,
            error: "Invalid name"
        });
    }
    TaskModel.exists({"name": req.body.name}).then(is_exsist => {
        if (is_exsist){
            return res.status(208).json({code: 208});
        }
        TaskModel.create({"name": req.body.name, "is_active": true})
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
    TaskModel.deleteMany({"is_active": false})
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
    if (!ObjectId.isValid(req.body.id) || typeof(req.body.status) !== "boolean"){
        return res.status(400).json({
            code: 400,
            error: "Invalid request"
        })
    }
    TaskModel.findByIdAndUpdate(req.body.id, {$set: {"is_active": req.body.status}})
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
    const all_req = req.body.all_comp;
    if (typeof(all_req) !== "boolean"){
        return res.status(400).json({
            code: 400
        })
    }
    TaskModel.updateMany({"is_active": !all_req}, {$set: {"is_active": all_req}})
        .then((result) => {
            if (!result) {
                throw result;
            }
            res.status(200).json({code: 200});
            console.log(result);
        })
        .catch(() => {
            res.status(500).json({code: 500});
        })
};

exports.changeName = (req, res) => {
    if (!ObjectId.isValid(req.body.id) || !(req.body.name.length > 0)){
        return res.status(400).json({code: 400});
    }
    TaskModel.exists({"name": req.body.name}).then(is_exists => {
        if (is_exists){
            return res.status(208).json({code: 208});
        }
        TaskModel.findByIdAndUpdate(new ObjectId(req.body.id), {$set: {"name" : req.body.name}})
            .then(result => {
                console.log(result);
                res.status(200).json({code: 200});
            })
            .catch(() => {
                res.status(500).json({code: 500});
            })
    })
};
