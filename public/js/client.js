function onSignIn(user){
    var profile = user.getBasicProfile();
    console.log(JSON.stringify(profile));
    var id_token = profile.getEmail()//user.getAuthResponse().id_token;
   
   //put the google id into the form
    var idInput = document.querySelector('input[name="user_id"]');
    idInput.setAttribute("value",id_token);

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

