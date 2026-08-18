// ========================================
// EJAR SOLUTIONS - BLOG FRONTEND
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadBlogs();

});

async function loadBlogs() {

    try {

        const blogs = await Api.publicGet("/blogs");

        const container =
            document.getElementById("blogContainer");

        if (!container) return;

        container.innerHTML = "";

        const publishedBlogs = blogs
            .filter(blog => blog.status === "published");

        if (!publishedBlogs.length) {
            container.innerHTML = `
                <div class="col-lg-12">
                    <p class="text-center">Articles are being prepared. Please check back soon.</p>
                </div>
            `;
            return;
        }

        publishedBlogs.forEach(blog => {

                const image = API.assetUrl(blog.image);

                container.innerHTML += `

                <div class="col-lg-4">

                    <article class="blog-card">

                        <img
                            src="${image}"
                            class="img-fluid mb-3"
                            alt="${blog.title}">

                        <span class="division-pill">

                            ${blog.category}

                        </span>

                        <h2>

                            ${blog.title}

                        </h2>

                        <p>

                            ${blog.excerpt}

                        </p>

                        <div class="green-button">

                            <a href="blog-detail.html?id=${blog.id}">

                                Read More

                            </a>

                        </div>

                    </article>

                </div>

                `;

            });

    }

    catch (err) {

        console.error(err);

        const container =
            document.getElementById("blogContainer");

        if (container) {
            container.innerHTML = `
                <div class="col-lg-12">
                    <p class="text-center">Unable to load articles right now. Please try again later.</p>
                </div>
            `;
        }

    }

}
