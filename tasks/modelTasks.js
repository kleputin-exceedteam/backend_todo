const mongoose = require("mongoose");

module.exports = () => {
    return mongoose.model(
        "Tasks",
        mongoose.Schema(
            {
                name: String,
                is_active: Boolean
            },
        )
    );
};
