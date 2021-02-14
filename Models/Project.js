const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true
    },
    techStack: {
        type: String,
    },
    github: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video: {
        type: String,
    },
    hosted: {
        type: String
    },
    difficulty: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})

module.exports = mongoose.model("Project", projectSchema);