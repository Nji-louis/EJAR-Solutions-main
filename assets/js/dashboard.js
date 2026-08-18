document.addEventListener("DOMContentLoaded", async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        document.getElementById("adminName").innerText = user.name;
    }

    try {

        const data = await Api.get("/admin/dashboard");

        if (!data.stats) {
    alert("Dashboard data could not be loaded.");
    return;
}

        document.getElementById("totalUsers").innerText =
            data.stats.totalUsers;

        document.getElementById("totalMessages").innerText =
            data.stats.totalMessages;

        document.getElementById("newMessages").innerText =
            data.stats.newMessages;

        const table =
            document.getElementById("recentMessages");

        table.innerHTML = "";

        data.recentMessages.forEach(msg => {

            table.innerHTML += `

<tr>

<td>${msg.name}</td>

<td>${msg.email}</td>

<td>${msg.subject}</td>

<td>${msg.status}</td>

</tr>

`;

        });

    } catch (err) {

        console.error(err);

        alert("Failed to load dashboard.");

    }

    document.getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.clear();

            window.location.href = "login.html";

        });

});
