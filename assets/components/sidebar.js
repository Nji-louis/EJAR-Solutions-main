const currentUser =
    JSON.parse(localStorage.getItem("user") || "{}");

const isAdmin =
    currentUser.role === "admin";

document.write(`

<div class="sidebar">

<div class="logo">
EJAR SOLUTIONS
</div>

<a href="dashboard.html">🏠 Dashboard</a>

<a href="services.html">🛠 Services</a>

<a href="messages.html">📩 Messages</a>

<a href="gallery.html">🖼 Gallery</a>

${isAdmin ? `
<a href="users.html">👥 Users</a>
<a href="settings.html">⚙ Settings</a>
` : ""}

<hr>

<a href="#" id="logoutBtn">
🚪 Logout
</a>

</div>

`);