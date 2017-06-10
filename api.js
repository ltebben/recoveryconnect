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

    //extract the id_token from request
    var token = req.body.idtoken;

    //verify id token is valid
    userIsValid(token);

    var isValid = new Promise(function(resolve, reject){
        
    });

    //check if user is in the DB
    //userExists();

    //if so, return 'exists'
    //res.send('exists');

});

function userIsValid(token){
    client.verifyIdToken(
        token,
        env.GOOGLE_CLIENT_ID,
        function(e, login) {
            if(!e){
                var payload = login.getPayload();
                var userid = payload['sub'];
                //lookup token in db
                if(userExists(userId)){
                    res.send('exists');
                }else{
                    res.send('user not found');
                }

            }else{  
                console.log('e: ' + e);
                res.send(e.message);
            }
        });
}

function userExists(userId){
    var user = User.find({user_id:userId});
    if(user){
        return true;
    }else{
        return false;
    }
}



module.exports = router;