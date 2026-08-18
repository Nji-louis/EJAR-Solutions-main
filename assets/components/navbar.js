document.write(`

<div class="topbar">

<h4>Admin Dashboard</h4>

<div>

Welcome,
<strong id="adminName"></strong>

</div>

</div>

`);

const user = JSON.parse(localStorage.getItem("user"));

if(user){

document.getElementById("adminName").innerHTML=user.name;

}

const logout=document.getElementById("logoutBtn");

if(logout){

logout.onclick=function(){

localStorage.removeItem("token");

localStorage.removeItem("user");

window.location.href="login.html";

};

}