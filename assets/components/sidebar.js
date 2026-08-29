const currentUser =
    JSON.parse(localStorage.getItem("user") || "{}");

const isAdmin =
    currentUser.role === "admin";

const currentPage =
    window.location.pathname.split("/").pop();

function active(page) {
    return currentPage === page ? "active" : "";
}

document.write(`

<div class="sidebar">

    <div class="logo">
        EJAR SOLUTIONS
    </div>

    <a href="dashboard.html" class="${active("dashboard.html")}">
        🏠 Dashboard
    </a>

    <a href="counters.html" class="${active("counters.html")}">
        📊 Homepage Counters
    </a>

    <a href="why_choose_us.html" class="${active("why_choose_us.html")}">
        ⭐ Why Choose Us
    </a>

    <a href="services.html" class="${active("services.html")}">
        🛠 Services
    </a>

    <a href="partners.html" class="${active("partners.html")}">
        🤝 Partners
    </a>

    <a href="gallery.html" class="${active("gallery.html")}">
        🖼 Gallery
    </a>

    <a href="blogs.html" class="${active("blogs.html")}">
        📝 Blog
    </a>

    <a href="testimonials.html" class="${active("testimonials.html")}">
        💬 Testimonials
    </a>

    <a href="faqs.html" class="${active("faqs.html")}">
        ❓ FAQs
    </a>

    <a href="messages.html" class="${active("messages.html")}">
        📩 Messages
    </a>

    ${isAdmin ? `
        <a href="users.html" class="${active("users.html")}">
            👥 Users
        </a>

        <a href="settings.html" class="${active("settings.html")}">
            ⚙ Settings
        </a>
    ` : ""}

    <hr>

    <a href="#" id="logoutBtn">
        🚪 Logout
    </a>

</div>

`);





