let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let mongoose = require("mongoose");
let url = "mongodb://localhost:27017/theDB";
const Dev = require("./models/dev");
const Task = require("./models/task");
let db;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static("images"))
app.use(express.static("styles"))

app.use(bodyParser.urlencoded({
    extended: false
}))

mongoose.connect(url, function (err) {
    if (err) {
        console.log("Error in Mongoose connection.");
        throw err;
    } else {
        console.log("Successful connection!");
    }

    app.get('/', (req, res) => {
        res.render("index.html");
    })

    app.get('/devAdd.html', (req, res) => {
        res.render("devAdd.html");
    })

    app.get('/devRemove.html', (req, res) => {
        res.render("devRemove.html");
    })

    app.get('/devList.html', (req, res) => {
        Dev.find({}, function (err, docs) {
            res.render("devList.html", { devs: docs })
        })
    })

    app.get('/taskAdd.html', (req, res) => {
        res.render("taskAdd.html");
    })

    app.get('/taskUpdate.html', (req, res) => {
        res.render("taskUpdate.html");
    })

    app.get('/taskRemove.html', (req, res) => {
        res.render("taskRemove.html");
    })

    app.get('/taskList.html', (req, res) => {
        Task.find({}, function (err, docs) {
            res.render("taskList.html", { tasks: docs })
        })
    })

    app.post('/devNew', (req, res) => {
        Dev.create({
            _id: new mongoose.Types.ObjectId(),
            name: {
                firstName: req.body.devFName,
                lastName: req.body.devLName,
            },
            level: req.body.level,
            address: {
                state: req.body.state,
                suburb: req.body.suburb,
                street: req.body.street,
                unit: req.body.unit
            }
        }, function (err) {
            if (err)
                res.send(err);
            else {
                console.log("Dev creation successful.")
                Dev.find({}, function (err, docs) {
                    res.render("devList.html", { devs: docs })
                })
            }
        })
    })

    app.post('/taskNew', (req, res) => {
        Task.create({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.taskName,
            assignTo: req.body.assignTo,
            due: req.body.dueDate,
            status: req.body.status,
            description: req.body.description,
        }, function (err) {
            if (err)
                res.send(err);
            else {
                console.log("Task creation successful.")
                Task.find({}, function (err, docs) {
                    res.render("taskList.html", { tasks: docs })
                })
            }
        })
    })

    app.post('/taskDelete', (req, res) => {
        Task.deleteOne({ "_id": req.body.taskId }, function (err, doc) {
            if (err) {
                console.log("Error in task removal.");
                throw err;
            }
            console.log("Task " + req.body.taskId + " removed.")
            Task.find({}, function (err, docs) {
                res.render("taskList.html", { tasks: docs })
            })
        })
    })

    app.post('/taskDeleteC', (req, res) => {
        Task.deleteMany({ "status": "Complete" }, function (err, doc) {
            if (err) {
                console.log("Error in complete tasks removal.");
                throw err;
            }
            console.log("All completed tasks removed.")
            Task.find({}, function (err, docs) {
                res.render("taskList.html", { tasks: docs })
            })
        })
    })

    app.post('/taskUpdate', (req, res) => {
        if (req.body.status === "InProgress" || req.body.status === "Complete") {
            Task.updateOne({ "_id": req.body.taskId }, { $set: { "status": req.body.status } }, function (err, doc) {
                if (err) {
                    console.log("Error in task update.");
                    throw err;
                }
                console.log("Task " + req.body.taskId + " updated.")
                Task.find({}, function (err, docs) {
                    res.render("taskList.html", { tasks: docs })
                })
            })
        } else {
            res.send("Status should be either 'InProgress' or 'Complete'");
        }
    })
})

app.listen(8080);