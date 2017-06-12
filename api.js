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
    
    console.log(parseInt(req.body.sobriety_year));
    var mo;
    switch(req.body.sobriety_month){
        case "January":
            mo = 1;
            break
        case "February":
            mo = 2;
            break
        case "March":
            mo = 3;
            break
        case "Arpil":
            mo = 4;
            break;
        case "May":
            mo = 5;
            break;
         case "June":
            mo = 6;
            break;
         case "July":
            mo = 7;
            break;
         case "August":
            mo = 8;
            break;
         case "September":
            mo = 9;
            break;
         case "October":
            mo = 10;
            break;
         case "November":
            mo = 11;
            break;
        case "December":
            mo = 12;
            break;        
    }

    console.log(mo);
    var newUser = new User({
        user_id: req.body.user_id,
        firstName : req.body.firstName,
        middleInitial : req.body.middleInitial,
        neighborhood : req.body.neighborhood,
        gender : req.body.gender,
        age : parseInt(req.body.age),
        sobriety_year: parseInt(req.body.sobriety_year),
        sobriety_month: req.body.sobriety_month
    });
    
    newUser.sobriety_date.setMonth(mo - 1);
    newUser.sobriety_date.setYear(parseInt(req.body.sobriety_year));

    var saved = new Promise(function(resolve,reject){
            newUser.save(function(err){
            if(!err){
                resolve('saved');
                //res.render('dashboard');
            }else{
                console.log('error saving: ' + err);
                resolve('did not save');
            }
        });
    });

    saved.then(function(result){
        if(result == 'saved'){
            res.render('start');
        }else if('did not save'){
            res.redirect('/');
        } else {
            res.send('ruffalo');
        }
    });

});

router.get('/connection',function(req,res){
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
    var query = User.findOne({user_id:req.session.email});
    var promise = query.exec();
    var retVal = promise.then(function(data){
        if(JSON.stringify(data).length > 3){
            var sent_msgs = data.posted_message;
            sent_msgs.forEach(function(me){
                 me.sender = "me";
            });
            var partner_email = data.partner;
            var p_query = User.findOne({ user_id:partner_email });
            var p_promise = p_query.exec();
            p_promise.then(function (data2) {
                if (JSON.stringify(data2).length > 3) {
                    var p_received_msgs = data2.posted_message;
                    p_received_msgs.forEach(function(m){
                        m.sender = data2.firstName;
                    });
                    var msgs = sent_msgs.concat(p_received_msgs);
                    msgs = msgs.sort(function (a,b){
                        return b.date - a.date;
                    });

                    var Sober = Math.floor((new Date() - data.sobriety_date)/(1000*60*60*24));
                    
                    res.render('dashboard', { partner: data.firstName, messages: msgs, days_sober: Sober });
                  } else {
                    console.log('No messages found');
                }

            });
        }else{
            res.send('not found');
        }
    });    
})

//checks if user exists in db already. if not, prompts for data
router.use('/exists',function(req,res){

    //extract the id_token from request
    var token = req.body.id_token;
    req.session.email = token;

    userExists(token,res);

});

router.use('/sendMessage',function(req,res){
    var recipient = User.find({user_id: req.body.email});
    var promise = recipient.exec();
    promise.then(function (data) {
        if (JSON.stringify(data).length > 3) {
            var partner_email = data[0].partner;
            var p_query = User.findOne({ user_id:partner_email });
            var p_promise = p_query.exec();
            p_promise.then(function (data2) {
                if (JSON.stringify(data2).length > 3) {
                    var temp = data2.posted_message.concat([{ message: req.body.message, date: Date.now() }]);
                    User.update({ user_id: data2.user_id }, { $set: { posted_message: temp } }, function (err, changedCount) {
                        if (!err) {
                            console.log('num changed: ' + JSON.stringify(changedCount));
                        }
                        else {
                            console.log('err: ' + err);
                        }
                    });

                    res.render('dashboard', { partner: data.firstName, messages: msgs, days_sober: Sober });
                } else {
                    console.log('No messages found');
                }

            });
            
        }else{
            console.log("no user")
            res.send('not found');
        }
    });  
    console.log('done');  
});

//takes a user id token and checks if it's in the db
//if in the db, returns true, else false.
function userExists(userId,res){
    var query = User.find({user_id:userId});
    var promise = query.exec();
    var retVal = promise.then(function(data){
        if(JSON.stringify(data).length > 3){
            res.send('exists');
        }else{
            res.send('not found');
        }
    });    
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