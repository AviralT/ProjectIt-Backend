let mongoose = require("mongoose");


const UserSession = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    session: {type: String}
})

module.exports = mongoose.model("UserSession", UserSession);
