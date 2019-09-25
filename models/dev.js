const mongoose = require("mongoose");

var devSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        uppercase: true,
        required: true,
        validate: {
            validator: function (levelValue) {
                return levelValue === "EXPERT" || levelValue === "BEGINNER";
            },
            message: "Level should be either 'Beginner' or 'Expert'"
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
    }
})

module.exports = mongoose.model("Dev", devSchema);