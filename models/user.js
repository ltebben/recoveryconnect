var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user_id: String,
    firstName: String,
    middleInitial: String,
    neighborhood: String,
    gender: String,
    age: Number,
    sobriety_year: Number,
    sobriety_month: Number,
    sobriety_date: Date,
    connected: Boolean,
    partner: String,
    posted_message: [{message: String, date: Date()}]
});

module.exports = mongoose.model("User", userSchema);