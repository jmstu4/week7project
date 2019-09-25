const mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dev"
    },
    due: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        required: true,
        validate: {
            validator: function (statusValue) {
                return statusValue === "InProgress" || statusValue === "Complete";
            },
            message: "Status should be either 'InProgress' or 'Complete'"
        }
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model("Task", taskSchema);