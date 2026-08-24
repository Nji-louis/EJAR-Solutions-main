(function () {
    "use strict";

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
        window.location.href = "login.html";
        return;
    }

    Api.get("/users/profile").then((profile) => {
        if (
    !profile ||
    !["admin", "editor"].includes(profile.role)
) {
    Api.redirectToLogin();
}
    }).catch(() => {
        Api.redirectToLogin();
    });
})();
