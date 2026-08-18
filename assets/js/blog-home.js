// ========================================
// EJAR SOLUTIONS - HOMEPAGE BLOG PREVIEW
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadHomepageBlogs();

});


// ========================================
// LOAD LATEST BLOG POSTS
// ========================================

async function loadHomepageBlogs() {

    try {

        const blogs =
            await Api.publicGet("/blogs");

        const container =
            document.getElementById(
                "homepageBlogContainer"
            );

        if (!container) {

            console.error(
                "Homepage blog container not found."
            );

            return;

        }


        if (!Array.isArray(blogs)) {

            console.error(
                "Blog API did not return an array:",
                blogs
            );

            return;

        }


        container.innerHTML = "";


        // Only published posts
        // Show the latest 3

        const publishedBlogs =
            blogs
                .filter(blog =>
                    blog.status === "published"
                )
                .slice(0, 3);


        publishedBlogs.forEach(blog => {

            const image =
                blog.image
                    ? API.assetUrl(blog.image)
                    : "assets/images/service-image-01.jpg";


            const category =
                blog.category ||
                "EJAR SOLUTIONS";


            const title =
                blog.title ||
                "";


            const excerpt =
                blog.excerpt ||
                "";


            const slug =
                blog.slug ||
                blog.id;


            container.innerHTML += `

                <div class="col-lg-4">

                    <article class="blog-card">

                        <span class="division-pill">
                            ${category}
                        </span>

                        <img
                            src="${image}"
                            alt="${title}"
                            class="img-fluid">

                        <h2>
                            ${title}
                        </h2>

                        <p>
                            ${excerpt}
                        </p>

                        <div class="green-button">

                            <a href="blog-detail.html?slug=${encodeURIComponent(slug)}">
                                Read Article
                            </a>

                        </div>

                    </article>

                </div>

            `;

        });


        // If there are no published posts

        if (publishedBlogs.length === 0) {

            container.innerHTML = `

                <div class="col-12 text-center">

                    <p>
                        No blog articles available at the moment.
                    </p>

                </div>

            `;

        }

    }

    catch (error) {

        console.error(
            "Unable to load homepage blogs:",
            error
        );

    }

}