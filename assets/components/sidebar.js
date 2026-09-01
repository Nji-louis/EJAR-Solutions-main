(function () {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    const sections = [
        {
            title: "Overview",
            links: [
                ["dashboard.html", "fa-chart-line", "Dashboard"]
            ]
        },
        {
            title: "Website Content",
            links: [
                ["counters.html", "fa-chart-bar", "Homepage Counters"],
                ["why_choose_us.html", "fa-star", "Why Choose Us"],
                ["partners.html", "fa-handshake", "Partners"],
                ["gallery.html", "fa-images", "Gallery"],
                ["blogs.html", "fa-blog", "Blog"],
                ["testimonials.html", "fa-comments", "Testimonials"],
                ["faqs.html", "fa-question-circle", "FAQs"],
                ["team.html", "fa-users", "Team"]
            ]
        },
        {
            title: "Communication",
            links: [
                ["messages.html", "fa-envelope", "Messages"],
                ["newsletter.html", "fa-newspaper", "Newsletter"]
            ]
        },
        {
            title: "Administration",
            adminOnly: true,
            links: [
                ["users.html", "fa-user-shield", "Users"],
                ["settings.html", "fa-cog", "Settings"]
            ]
        }
    ];

    function navLink([href, icon, label]) {
        const active = currentPage === href ? "active" : "";

        return `
            <a href="${href}" class="${active}" aria-current="${active ? "page" : "false"}">
                <i class="fa ${icon}" aria-hidden="true"></i>
                <span>${label}</span>
            </a>
        `;
    }

    function normalizeMainLayout() {
        document
            .querySelectorAll("body > .sidebar, .container-fluid > .row > .col-md-2")
            .forEach((element) => element.remove());

        const bootstrapMain = document.querySelector(".container-fluid > .row > .col-md-10");
        const directMain = document.querySelector("body > .main");
        const main = bootstrapMain || directMain;

        if (!main) return;

        main.classList.add("main");
        main.classList.remove("col-md-10", "col-lg-10", "col-xl-10");
        main.removeAttribute("style");
    }

    function renderSidebar() {
        normalizeMainLayout();

        const navSections = sections
            .filter((section) => !section.adminOnly || isAdmin)
            .map((section) => `
                <div class="sidebar-section">
                    <div class="sidebar-section-title">${section.title}</div>
                    ${section.links.map(navLink).join("")}
                </div>
            `)
            .join("");

        const sidebar = document.createElement("aside");
        sidebar.className = "sidebar";
        sidebar.innerHTML = `
            <div class="sidebar-brand">
                <span class="sidebar-brand-mark">E</span>
                <span>
                    <strong>EJAR</strong>
                    <small>Admin CMS</small>
                </span>
            </div>

            <nav class="sidebar-nav" aria-label="Admin navigation">
                ${navSections}
            </nav>

            <div class="sidebar-footer">
                <a href="#" id="logoutBtn">
                    <i class="fa fa-sign-out-alt" aria-hidden="true"></i>
                    <span>Logout</span>
                </a>
            </div>
        `;

        document.body.classList.add("admin-layout");
        document.body.insertBefore(sidebar, document.body.firstChild);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderSidebar);
    } else {
        renderSidebar();
    }
}());
