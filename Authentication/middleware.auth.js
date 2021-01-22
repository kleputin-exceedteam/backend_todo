const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token");
    if (!token) return res.status(403).json({message: "No token provided"});

    try {
        const decoded = jwt.verify(token, "randomString");
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).send({message: "Invalid Token"});
    }
};
