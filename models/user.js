var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    firstName: String,
    neighborhood: String,
    gender: String,
    age: Number,
    status: String
});

module.exports = mongoose.model("User", userSchema);