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
    var newUser = new User({
        user_id: req.user_id,
        firstname : req.firstName,
        middleInitial : req.middleInitial,
        neighborhood : req.neighborhood,
        gender : req.gender,
        age : req.age,
        sobriety_date : Date(req.sobriety_year, req.sobriety_month)
    });

    var saved = new Promise(function(resolve,reject){
            newUser.save(function(err){
            if(!err){
                resolve('saved');
                //res.render('dashboard');
            }else{
                resolve('did not save');
            }
        });
    });

    saved.then(function(result){
        if(result == 'saved'){
            res.send('saveew');
        }else{
            res.send('femk')
        }
    });

});

router.get('/connect',function(req,res){
    var _neighborhood = req.neighborhood;
    var _gender = req.gender;
    var _age = req.age;
    var _sobriety_date = new Date(req.sobriety_year, req.sobriety_month);

    if(_sobriety_date.getYear() - Date.now.getYear() < 1){
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()+1);
        User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$gt: _age}, sobriety_date: {$gte: desired_date}, connected: false}, function(err){
            if(err){

            }
            else{
                User.connected = true;
                req.connected = true;
            }
        })
    }
    else{
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()-1);
        User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$lt: _age}, sobriety_date: {$lte: desired_date}, connected: false}, function(err){
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

    //extract the id_token from request
    var token = req.body.idtoken;

    if(userExists(token) == true){
        res.send('exists');
    }else{
        res.send('not found');
    }

});


//takes a user id token and checks if it's in the db
//if in the db, returns true, else false.
function userExists(userId){
    var user = User.find({user_id:userId});
    console.log('user: ' + user.toString());

    if(user.firstName){
        return true;
    }else{
        return false;
    }
}

module.exports = router;

//takes the user token and checks if its valid using google auth api
//returns true if valid and false otherwise
/*
function userIsValid(token){
        client.verifyIdToken(
        token,
        env.GOOGLE_CLIENT_ID,
        function(e, login) {
            return new Promise(function(resolve,reject){
                if(!e){
                var payload = login.getPayload();
                var userid = payload['sub'];

                //var exists = userExists(token);
                console.log('exists: ' + exists);

                resolve(true);

                }else{  
                    resolve(false);
                }
            });
        });
        resolve('lool');    
}
*/