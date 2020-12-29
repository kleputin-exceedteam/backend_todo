const express = require("express");
const bodyParser = require("body-parser");
const TasksRouter = require("./tasks/TasksRouter");
const db = require("./models");

const app = express();

app.use(bodyParser.json());
app.use('/api/tasks', TasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Connection established!");
    })
    .catch(err => {
        console.log("Cannot connect to database!", err);
        process.exit(1);
    });

/*

app.patch("/api/change_name", function (req, res) {
    database.updateOne({_id: new objectId(req.body.id) }, {$set: {"name": req.body.name}},  function (err, result) {
        if (err) {
            return manageError(res, err.message, "Failed to change name");
        }
        res.status(200).json({code: 200, new_name: result});
        console.log(req.body.name);
    });
});
*/

