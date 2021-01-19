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


