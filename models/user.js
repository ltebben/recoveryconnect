var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user_id: String,
    firstName: String,
    neighborhood: String,
    gender: String,
    age: Number,
    sobriety_year: Number,
    sobriety_month: Number,
    connected: Boolean
});

module.exports = mongoose.model("User", userSchema);