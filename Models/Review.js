const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    rating: {
        type: Number
    }
})

module.exports = mongoose.model('Review', reviewSchema);