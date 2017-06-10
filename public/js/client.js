function onSignIn(user){
    var profile = user.getBasicProfile();
    var id_token = user.getAuthResponse().id_token;
   
    //check if the user exists, if not, need to prompt for info
    //if(fetch){
        //ask api if user exists
        //fetch(`/api/exists?id=${id_token}`)
    //}else{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/api/exists');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            console.log('Signed in as: ' + xhr.responseText);
        };
        xhr.send('idtoken=' + id_token);
    //}
}

