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

router.get('/connect',function(req,res){
    
});


module.exports = router;