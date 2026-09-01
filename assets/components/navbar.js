(function () {
    const pageTitles = {
        "dashboard.html": "Dashboard",
        "counters.html": "Homepage Counters",
        "why_choose_us.html": "Why Choose Us",
        "partners.html": "Partners",
        "gallery.html": "Gallery",
        "blogs.html": "Blog",
        "testimonials.html": "Testimonials",
        "faqs.html": "FAQs",
        "team.html": "Team",
        "messages.html": "Messages",
        "newsletter.html": "Newsletter",
        "users.html": "Users",
        "settings.html": "Settings"
    };

    function renderNavbar() {
        const main = document.querySelector(".main");
        if (!main || main.querySelector(".topbar")) return;

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
        const title = pageTitles[currentPage] || "Admin Dashboard";
        const initials = (user.name || "Admin")
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

        const topbar = document.createElement("header");
        topbar.className = "topbar";
        topbar.innerHTML = `
            <button class="nav-toggle" type="button" aria-label="Toggle navigation">
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button>

            <div class="topbar-title">
                <span>Admin</span>
                <h1>${title}</h1>
            </div>

            <div class="topbar-actions">
                <a href="../index.html" class="site-link">
                    <i class="fa fa-globe" aria-hidden="true"></i>
                    <span>View Site</span>
                </a>

                <div class="user-chip">
                    <span class="user-avatar">${initials || "A"}</span>
                    <span>
                        <strong id="adminName">${user.name || "Admin"}</strong>
                        <small>${user.role || "User"}</small>
                    </span>
                </div>
            </div>
        `;

        main.insertBefore(topbar, main.firstChild);

        topbar.querySelector(".nav-toggle").addEventListener("click", () => {
            document.body.classList.toggle("sidebar-open");
        });

        document.addEventListener("click", (event) => {
            const sidebar = document.querySelector(".sidebar");
            const toggle = topbar.querySelector(".nav-toggle");

            if (
                document.body.classList.contains("sidebar-open") &&
                sidebar &&
                !sidebar.contains(event.target) &&
                !toggle.contains(event.target)
            ) {
                document.body.classList.remove("sidebar-open");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderNavbar);
    } else {
        renderNavbar();
    }
}());
