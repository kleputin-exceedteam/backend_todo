const AuthController = require('./AuthController');
const express = require("express");
const { check } = require("express-validator/check");

const router = express.Router();

router.post('/login', [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
], AuthController.login);
router.get('/user', AuthController.get);
router.post('/signup', [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
], AuthController.signUp);

module.exports = router;
