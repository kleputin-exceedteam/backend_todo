const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

const { user } = require('../models');

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {username, password} = req.body;

    try{
        let User = await user.findOne({username});
        if (!User){
            return res.status(400).json({
                error: "User not exist"
            });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch){
            return res.status(400).json({
                error: "Incorrect password!"
            })
        }
        jwt.sign(
            {
                user: {
                    id: User._id
                }
            },
            "randomString", {expiresIn: 10000},
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                    token
                });
            }
        );
    }catch (e) {
        res.status(500).send('Server error');
    }
}

exports.get = async (req, res) => {
    const token = req.header("token");
    const decoded = jwt.verify(token, "randomString");
    const User = decoded.user;
    try{
        const result = await user.findById(User.id);
        return res.json(result);
    } catch (e ) {
        return res.status(500).json({
            error: "Server error!"
        })
    }
}

exports.signUp =
    async (req, res ) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            username,
            password
        } = req.body;
        try {
            let NewUser = await user.findOne({
                username
            });
            if (NewUser) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }
            User = new user({
                username,
                password
            });

            const salt = await bcrypt.genSalt(10);
            User.password = await bcrypt.hash(password, salt);

            await User.save();

            const payload = {
                user: {
                    id: User.id
                }
            };
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
}
