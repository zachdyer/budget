var loginForm = document.getElementById("login");

var tryLogin = function(){
	loginForm.submit();
};

var submit = document.getElementById("submit").childNodes[0];
submit.addEventListener("click",tryLogin);
