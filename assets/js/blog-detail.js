document.addEventListener("DOMContentLoaded", () => {
    loadBlogDetail();
});

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) {
        element.setAttribute("content", value);
    }
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderParagraphs(content) {
    return String(content || "")
        .split(/\n{2,}/)
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
        .join("");
}

async function loadBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const article = document.getElementById("blogArticle");

    if (!id) {
        setText("blogTitle", "Article Not Found");
        setText("blogMeta", "Missing article reference");
        article.innerHTML = `
            <p>This article link is missing its reference. Please return to the blog and choose an article.</p>
            <div class="green-button"><a href="blog.html">Back to Blog</a></div>
        `;
        return;
    }

    try {
        const blog = await Api.publicGet(`/blogs/${id}`);

        if (!blog || blog.message || blog.status !== "published") {
            setText("blogTitle", "Article Not Available");
            setText("blogMeta", "EJAR GROUP SARL Insights");
            article.innerHTML = `
                <p>This article is not available right now.</p>
                <div class="green-button"><a href="blog.html">Back to Blog</a></div>
            `;
            return;
        }

        const title = blog.title || "EJAR GROUP SARL Article";
        const description = blog.meta_description || blog.excerpt || "";
        const category = blog.category || "EJAR GROUP SARL Insights";
        const author = blog.author ? ` · ${blog.author}` : "";
        const image = blog.image
            ? API.assetUrl(blog.image)
            : "assets/images/service-image01.jpg";

        document.title = blog.meta_title || `${title} | EJAR GROUP SARL Blog`;
        setMeta('meta[name="description"]', description);
        setMeta('meta[property="og:title"]', title);
        setMeta('meta[property="og:description"]', description);

        setText("blogTitle", title);
        setText("blogMeta", `${category}${author}`);

        article.innerHTML = `
            <img src="${image}" data-blog-image alt="${escapeHtml(title)}" class="img-fluid mb-4">
            ${category ? `<span class="division-pill">${escapeHtml(category)}</span>` : ""}
            ${renderParagraphs(blog.content || blog.excerpt)}
        `;

    } catch (error) {
        console.error(error);
        setText("blogTitle", "Unable to Load Article");
        setText("blogMeta", "EJAR GROUP SARL Insights");
        article.innerHTML = `
            <p>We could not load this article. Please try again later.</p>
            <div class="green-button"><a href="blog.html">Back to Blog</a></div>
        `;
    }
}
