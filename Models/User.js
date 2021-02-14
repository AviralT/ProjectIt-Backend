const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    emailId: {
        type: String,
        required: true,
        unique: true
    },

    encry_password: {
        type: String,
        required: true
    },

    linkedIn: {
        type: String
    },

    codeforces: {
        type: String
    },

    github: {
        type: String
    },

    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],

    profile: {
        type: Buffer,
        contentType: String
    }
})

userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {

    authentication: function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },

    securePassword: function(plainpassword){
        if (!plainpassword){
            return "";
        }
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainpassword)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema);
