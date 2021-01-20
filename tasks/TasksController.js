const ObjectId = require('mongodb').ObjectID;

const { tasks } = require("../models");

exports.get = (req, res) => {
    const { id } = req.user;
    if (!id) { res.status(400).json({
        code: 400,
        error: 'Auth error!'
    })}
    tasks.find({user: id})
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
        tasks.findByIdAndDelete(new ObjectId(req.params.id))
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
    const { id } = req.user;
    if (!id) { res.status(400).json({
        code: 400,
        error: 'Auth error!'
    })}
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
    tasks.findOneAndUpdate({name}, {name, is_active: true, user: id},
        {upsert: true, new: true, rawResult: true}, (err, result) => {
        if (err) return res.status(500).json({
            error: "Server error!"
        });
        if (result.lastErrorObject.updatedExisting){
            return res.status(208).json({
                code: 208
            })
        }
        return res.status(201).json({
            code: 201,
            _id: result.value._id
        })
    })
};

exports.deleteComp = (req, res) => {
    const { id } = req.user;
    if (!id) return res.status(500).json({error: 'Auth error!'});
    tasks.deleteMany({is_active: false, user: id})
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
    tasks.findByIdAndUpdate(id, {$set: {is_active: status}})
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
    const { id } = req.user;
    if (!id) return res.status(500).json({error: 'Auth error!'});

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
    tasks.updateMany({is_active: !all_comp, user: id}, {$set: {is_active: all_comp}})
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
    tasks.exists({name}).then(is_exists => {
        if (is_exists){
            return res.status(208).json({code: 208});
        }
        tasks.findByIdAndUpdate(new ObjectId(id), {$set: {name}})
            .then(() => {
                res.status(200).json({code: 200});
            })
            .catch(() => {
                res.status(500).json({code: 500});
            })
    })
};
