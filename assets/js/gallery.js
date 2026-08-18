// ========================================
// EJAR SOLUTIONS - GALLERY MANAGEMENT
// ========================================

let editingGalleryId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadGallery();

    const form = document.getElementById("galleryForm");

    form.addEventListener("submit", saveGallery);

});

// ========================================
// LOAD GALLERY
// ========================================

async function loadGallery() {

    try {

        const gallery = await Api.get("/gallery");

        const table = document.getElementById("galleryTable");

        table.innerHTML = "";

        gallery.forEach(image => {

            table.innerHTML += `

            <tr>

                <td>${image.id}</td>

                <td>${image.title}</td>

                <td>
    <img
        src="${API.assetUrl(image.image)}"
        width="80"
        height="60"
        style="object-fit:cover;border-radius:6px;">
</td>

                <td>${image.category || ""}</td>

                <td>${new Date(image.created_at).toLocaleDateString()}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${image.id}">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm delete-btn"
                        data-id="${image.id}">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        // Edit buttons

        document.querySelectorAll(".edit-btn").forEach(button => {

            button.addEventListener("click", () => {

                editGallery(button.dataset.id);

            });

        });

        // Delete buttons

        document.querySelectorAll(".delete-btn").forEach(button => {

            button.addEventListener("click", () => {

                deleteGallery(button.dataset.id);

            });

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load gallery.");

    }

}


// ========================================
// SAVE GALLERY
// ========================================

async function saveGallery(e) {

    e.preventDefault();

    try {

        const fileInput = document.getElementById("imageFile");

let imageUrl =
    document.getElementById("image").value;

if (fileInput.files.length > 0) {

    const uploadResult =
        await Api.upload(fileInput.files[0]);

    if (!uploadResult.success) {

        alert(uploadResult.message);

        return;

    }

    imageUrl = uploadResult.imageUrl;

    document.getElementById("image").value =
        imageUrl;
        document.getElementById("uploadStatus").innerHTML =
    "✓ Image uploaded successfully";

}

        const gallery = {

            title:
                document.getElementById("title").value,

            image: imageUrl,

            category:
                document.getElementById("category").value,

            description:
                document.getElementById("description").value

        };

        let result;

        if (editingGalleryId) {

            result = await Api.put(
                `/gallery/${editingGalleryId}`,
                gallery
            );

        } else {

            result = await Api.post(
                "/gallery",
                gallery
            );

        }

        alert(result.message);

        document.getElementById("galleryForm").reset();

        editingGalleryId = null;

        document.getElementById("form-submit").innerText =
            "Save Image";

        bootstrap.Modal.getInstance(
            document.getElementById("galleryModal")
        ).hide();

        loadGallery();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save gallery image.");

    }

}


// ========================================
// EDIT GALLERY
// ========================================

async function editGallery(id) {

    try {

        const image = await Api.get(`/gallery/${id}`);

        editingGalleryId = id;

        document.getElementById("title").value =
            image.title;

        document.getElementById("image").value =
            image.image;

        document.getElementById("category").value =
            image.category;

        document.getElementById("description").value =
            image.description;

        document.getElementById("form-submit").innerText =
            "Update Image";

        new bootstrap.Modal(
            document.getElementById("galleryModal")
        ).show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load gallery image.");

    }

}

// ========================================
// DELETE GALLERY
// ========================================

async function deleteGallery(id) {

    if (!confirm("Are you sure you want to delete this image?")) {

        return;

    }

    try {

        const result = await Api.delete(`/gallery/${id}`);

        alert(result.message);

        loadGallery();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete image.");

    }

}
