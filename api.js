var express = require('express');
var User = require('./models/user');
var router = express.Router();

router.get('/',function(req,res){
    resObj = {
        "hey": "hi"
        ,"thanks":"for pinging this api"
        ,"maybe": "instructions for use will be put here in the future"
    };

    res.send(resObj);
});

router.use('/signup', function(req,res){
    User.firstname = req.user.firstName;
    User.neighborhood = req.user.neighborhood;
    User.gender = req.user.gender;
    User.age = req.user.age;
    User.status = req.user.status;
});

router.get('/connect',function(req,res){
    var _neighborhood = req.user.neighborhood;
    var _gender = req.user.gender;
    var _age = req.user.age;
    var _status = req.user.status;

    User.find({neighborhood: _neighborhood, gender: _gender, age: {$gte: _age}, status: {$gte: _status}})
});


module.exports = router;