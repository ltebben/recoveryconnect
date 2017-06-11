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
        user_id: req.body.user_id,
        firstName : req.body.firstName,
        middleInitial : req.body.middleInitial,
        neighborhood : req.body.neighborhood,
        gender : req.body.gender,
        age : parseInt(req.body.age),
        sobriety_date : Date(parseInt(req.body.sobriety_year), parseInt(req.body.sobriety_month))
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
        }else if('did not save'){
            res.send('femk')
        } else {
            res.send('ruffalo');
        }
    });

});

router.get('/dashboard',function(req,res){
    var _neighborhood = req.neighborhood;
    var _gender = req.gender;
    var _age = req.age;
    var _sobriety_date = new Date(req.sobriety_year, req.sobriety_month);

    if(_sobriety_date.getYear() - Date.now.getYear() < 1){
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()+1);
        var match = User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$gt: _age}, sobriety_date: {$gte: desired_date}, connected: false}, function(err){
            if(err){
                // If can't find a match with no connections, allow for multiple connections
               /* User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$gt: _age}, sobriety_date: {$gte: desired_date}}, function(err){
                
                });*/
            }
            else{
                match.connected = true;
                match.partner = req.user_id;
                req.connected = true;
                req.partner = match.user_id;
            }
        })
    }
    else{
        var desired_date = new Date(_sobriety_date.getMonth(), _sobriety_date.getFullYear()-1);
        var match = User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$lt: _age}, sobriety_date: {$lte: desired_date}, connected: false}, function(err){
            if(err){
                // If can't find a match with no connections, allow for multiple connections
               /* User.findOne({neighborhood: _neighborhood, gender: _gender, age: {$lt: _age}, sobriety_date: {$lte: desired_date}}, function(err){
                
                });*/
            }
            else{
                match.connected = true;
                match.partner = req.user_id;
                req.connected = true;
                req.partner = match.user_id;
            }
        }) 
    }
});

router.use('/dashboard',function(req,res){
    var sent_msgs = req.user.posted_messages;
    var received_msgs = req.user.partner.posted_messages;
    var msgs = sent_msgs + received_msgs;
    msgs.sort(function(a,b){
        return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    })
    res.render('/dashboard', {partner: req.partner.firstName, messages: msgs})
})

//checks if user exists in db already. if not, prompts for data
router.use('/exists',function(req,res){

    //extract the id_token from request
    var token = req.body.id_token;

    if(userExists(token) == true){
        res.send('exists');
    }else{
        res.send('not found');
    }

});

//takes a user id token and checks if it's in the db
//if in the db, returns true, else false.
function userExists(userId){
    console.log('id: ' + userId);
    var query = User.find({user_id:userId});
    var promise = query.exec();
    var retVal = promise.then(function(data){
        return data;
    });
    
    return (JSON.stringify(retVal).length > 5);

    /*promise.then(function(docs){
        console.log('docs: ' + JSON.stringify(docs));
        if(docs.length > 0){
            return false;
        }else{
            return true;
        }
    });*/

    //console.log('retVal: ' + JSON.stringify(retVal));
    //return retVal;
    
   
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