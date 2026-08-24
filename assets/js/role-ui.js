document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    if (!user.role) return;

    const currentPage =
        window.location.pathname.split("/").pop();

    const adminOnlyPages = [
        "users.html",
        "settings.html"
    ];

    if (
        user.role === "editor" &&
        adminOnlyPages.includes(currentPage)
    ) {
        window.location.href = "dashboard.html";
        return;
    }

    if (user.role === "editor") {

        document
            .querySelectorAll(
                'a[href="users.html"], a[href="settings.html"]'
            )
            .forEach(link => {
                link.style.display = "none";
            });

        document
            .querySelectorAll(".admin-only")
            .forEach(element => {
                element.style.display = "none";
            });
    }

});