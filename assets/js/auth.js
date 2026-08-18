document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("loginForm");

if(!form) return;

form.addEventListener("submit", async(e)=>{

e.preventDefault();

const email=document.getElementById("email").value;

const password=document.getElementById("password").value;

const result=await Api.publicPost("/auth/login",{

email,

password

});

if(result.token){

localStorage.setItem("token",result.token);

localStorage.setItem("user",JSON.stringify(result.user));

window.location.href="dashboard.html";

}else{

alert(result.message);

}

});

});
