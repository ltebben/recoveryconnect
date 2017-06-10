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
    User.status = req.user.status;
});

router.get('/connect',function(req,res){
    
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