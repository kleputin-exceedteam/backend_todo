const mongoose = require("mongoose");

module.exports = () => {
    return mongoose.model(
        "Users",
        mongoose.Schema(
            {
                username: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tasks'}]
            },
        )
    );
};
