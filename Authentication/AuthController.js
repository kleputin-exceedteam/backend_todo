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
            return res.status(404).json({
                code: 404,
                mgs: "User not exist"
            });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (!isMatch){
            return res.status(406).json({
                code: 406,
                msg: "Incorrect password!"
            })
        }
        const payload = {user: {
            id: User._id
            }}
        const token = jwt.sign(
            payload,
            "randomString", {expiresIn: 2},
        );
        const refreshToken = jwt.sign(
            payload,
            "randomString", {expiresIn: 30000},
        );
        return res.status(200).json({
            token: token,
            refreshToken: refreshToken
        });
    }catch (e) {
        res.status(500).send('Server error');
    }
}

exports.refresh = (req, res) => {
    console.log('refreshing token');
    const {refToken} = req.body;
    try {
        const decoded = jwt.verify(refToken, "randomString");
        if (!decoded) {
            return res.status(401).json({
                message: "Refresh token is not valid"
            })
        }
        const payload = {
            user: {
                id: decoded.user.id
            }
        }
        const token = jwt.sign(
            payload,
            "randomString", {expiresIn: 2},
        );
        const refreshToken = jwt.sign(
            payload,
            "randomString", {expiresIn: 10},
        );
        return res.status(200).json({
            token: token,
            refreshToken: refreshToken
        });
    } catch (e) {
        return res.status(401).json({
            message: "Refresh token is not valid"
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
                return res.status(208).json({
                    code: 208,
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
            const token = jwt.sign(
                payload,
                "randomString", {expiresIn: 2},
            );
            const refreshToken = jwt.sign(
                payload,
                "randomString", {expiresIn: 30000},
            );
            return res.status(200).json({
                token: token,
                refreshToken: refreshToken
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
}
