function onSignIn(user){
    var profile = user.getBasicProfile();
    var id_token = profile.getEmail()//user.getAuthResponse().id_token;
   
   //put the google email into the form
    document.querySelector('input[name="user_id"]').setAttribute("value",profile.getEmail());

    //put first name into the form
    document.querySelector('input[name="firstName"]').setAttribute("value",profile.getName().substring(0,profile.getName().indexOf(' ')));

    //check if the user exists, if not, need to prompt for info
    //if(fetch){
        //ask api if user exists
        //fetch(`/api/exists?id=${id_token}`)
    //}else{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/api/exists');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.withCredentials = true;
        xhr.onload = function() {
            if(xhr.responseText == "exists"){
                document.querySelector('form.signup').classList.add('hide');
                window.location.href = '/api/dashboard'
            }
        };
        xhr.send('id_token=' + id_token);
    //}
}

