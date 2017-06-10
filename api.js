var env = require('./env');
var express = require('express');
var User = require('./models/user');
var router = express.Router();
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(env.GOOGLE_CLIENT_ID, '', '');

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
    User.sobriety_date = req.user.sobriety_date;
});

router.get('/connect',function(req,res){
    var _neighborhood = req.user.neighborhood;
    var _gender = req.user.gender;
    var _age = req.user.age;
    var _sobriety_date = new Date(req.user.sobriety_date);

    if(_sobriety_date.getYear() - Date.now.getYear() < 1){
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()+1);
        User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$gt: _age}, sobriety_date: {$gte: desired_date}}, function(err){
            if(err){

            }
            else{
                User.connected = true;
                req.user.connected = true;
            }
        })
    }
    else{
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()-1);
        User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$lt: _age}, sobriety_date: {$lte: desired_date}}, function(err){
            if(err){

            }
            else{
                User.connected = true;
                req.user.connected = true;
            }
        }) 
    }
});

//checks if user exists in db already. if not, prompts for data
router.use('/exists',function(req,res){
    console.log(`req.body: ${req.body.token}`);
    //extract the id_token from request
    var token = req.body.token;
    console.log(`token: ${token}`);

    //verify id token is valid
    /*client.verifyIdToken(
    token,
    env.GOOGLE_CLIENT_ID,
    function(e, login) {
      var payload = login.getPayload();
      var userid = payload['sub'];
      // If request specified a G Suite domain:
      //var domain = payload['hd'];
    });
    */

    //lookup token in db
    res.send('received');

});




module.exports = router;