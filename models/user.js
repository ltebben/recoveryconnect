var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user_id: String,
    firstName: String,
    neighborhood: String,
    gender: String,
    age: Number,
    status: String 
});

module.exports = mongoose.model("User", userSchema);