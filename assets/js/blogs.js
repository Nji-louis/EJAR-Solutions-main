// ========================================
// EJAR SOLUTIONS - BLOG MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadBlogs();

    document
        .getElementById("blogForm")
        .addEventListener("submit", saveBlog);

});

let editingId = null;
let imageUrl = "";

// ========================================
// LOAD BLOGS
// ========================================

async function loadBlogs() {

    try {

        const blogs = await Api.get("/blogs");

        const table =
            document.getElementById("blogsTable");

        table.innerHTML = "";

        blogs.forEach(blog => {

            table.innerHTML += `

            <tr>

                <td>${blog.id}</td>

                <td>

                    <img
                        src="${API.assetUrl(blog.image)}"
                        width="70">

                </td>

                <td>${blog.title}</td>

                <td>${blog.category || ""}</td>

                <td>

                    <span class="badge ${blog.status === "published"
                        ? "bg-success"
                        : "bg-secondary"}">

                        ${blog.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editBlog(${blog.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteBlog(${blog.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load blogs.");

    }

}

// ========================================
// IMAGE UPLOAD
// ========================================

document
.getElementById("image")
.addEventListener("change", async function () {

    if (!this.files.length) return;

    try {

        const result = await Api.upload(this.files[0]);

        imageUrl = result.imageUrl;

    }

    catch (err) {

        console.error(err);

        alert("Image upload failed.");

    }

});

// ========================================
// SAVE BLOG
// ========================================

async function saveBlog(e) {

    e.preventDefault();

    const data = {

        title:
            document.getElementById("title").value,

        slug:
            document.getElementById("slug").value,

        category:
            document.getElementById("category").value,

        excerpt:
            document.getElementById("excerpt").value,

        content:
            document.getElementById("content").value,

        image:
            imageUrl,

        author:
            document.getElementById("author").value,

        meta_title:
            document.getElementById("meta_title").value,

        meta_description:
            document.getElementById("meta_description").value,

        status:
            document.getElementById("status").value

    };

    try {

        let result;

        if (editingId) {

            result = await Api.put(
                `/blogs/${editingId}`,
                data
            );

        } else {

            result = await Api.post(
                "/blogs",
                data
            );

        }

        alert(result.message);

        document
            .getElementById("blogForm")
            .reset();

        imageUrl = "";
        editingId = null;

        document.getElementById("form-submit").innerText =
            "Save Blog";

        bootstrap.Modal
            .getInstance(
                document.getElementById("blogModal")
            )
            .hide();

        loadBlogs();

    }

    catch (err) {

        console.error(err);

        alert("Unable to save blog.");

    }

}

// ========================================
// EDIT BLOG
// ========================================

async function editBlog(id) {

    const blog = await Api.get(`/blogs/${id}`);

    editingId = id;

    imageUrl = blog.image;

    document.getElementById("title").value = blog.title;
    document.getElementById("slug").value = blog.slug;
    document.getElementById("category").value = blog.category;
    document.getElementById("excerpt").value = blog.excerpt;
    document.getElementById("content").value = blog.content;
    document.getElementById("author").value = blog.author;
    document.getElementById("meta_title").value = blog.meta_title;
    document.getElementById("meta_description").value = blog.meta_description;
    document.getElementById("status").value = blog.status;

    document.getElementById("form-submit").innerText =
        "Update Blog";

    new bootstrap.Modal(
        document.getElementById("blogModal")
    ).show();

}

// ========================================
// DELETE BLOG
// ========================================

async function deleteBlog(id) {

    if (!confirm("Delete this blog?")) return;

    const result =
        await Api.delete(`/blogs/${id}`);

    alert(result.message);

    loadBlogs();

}