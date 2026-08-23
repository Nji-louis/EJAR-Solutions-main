// ========================================
// EJAR SOLUTIONS - TESTIMONIALS MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTestimonials();

    document
        .getElementById("testimonialForm")
        .addEventListener("submit", saveTestimonial);

});

let editingId = null;
let imageUrl = "";

// ========================================
// LOAD TESTIMONIALS
// ========================================

async function loadTestimonials() {

    try {

        const testimonials = await Api.get("/testimonials");

        const table =
            document.getElementById("testimonialTable");

        table.innerHTML = "";

        testimonials.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.id}</td>

                <td>

                    <img
                        src="${API.assetUrl(item.image)}"
                        width="70">

                </td>

                <td>${item.name}</td>

                <td>${item.company || ""}</td>

                <td>

                    <span class="badge ${item.status === "active"
                        ? "bg-success"
                        : "bg-secondary"}">

                        ${item.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editTestimonial(${item.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteTestimonial(${item.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load testimonials.");

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
// SAVE
// ========================================

async function saveTestimonial(e) {

    e.preventDefault();

    const data = {

        name:
            document.getElementById("name").value,

        company:
            document.getElementById("company").value,

        position:
            document.getElementById("position").value,

        testimonial:
            document.getElementById("testimonial").value,

        image:
            imageUrl,

        rating:
            document.getElementById("rating").value,

        status:
            document.getElementById("status").value

    };

    try {

        let result;

        if (editingId) {

            result = await Api.put(
                `/testimonials/${editingId}`,
                data
            );

        }

        else {

            result = await Api.post(
                "/testimonials",
                data
            );

        }

        alert(result.message);

        document
            .getElementById("testimonialForm")
            .reset();

        imageUrl = "";
        editingId = null;

        bootstrap.Modal
            .getInstance(
                document.getElementById("testimonialModal")
            )
            .hide();

        loadTestimonials();

    }

    catch (err) {

        console.error(err);

        alert("Unable to save testimonial.");

    }

}

// ========================================
// EDIT
// ========================================

async function editTestimonial(id) {

    const item =
        await Api.get(`/testimonials/${id}`);

    editingId = id;

    imageUrl = item.image;

    document.getElementById("name").value =
        item.name;

    document.getElementById("company").value =
        item.company;

    document.getElementById("position").value =
        item.position;

    document.getElementById("testimonial").value =
        item.testimonial;

    document.getElementById("rating").value =
        item.rating;

    document.getElementById("status").value =
        item.status;

    document.getElementById("form-submit").innerText =
        "Update Testimonial";

    new bootstrap.Modal(
        document.getElementById("testimonialModal")
    ).show();

}

// ========================================
// DELETE
// ========================================

async function deleteTestimonial(id) {

    if (!confirm("Delete this testimonial?")) return;

    const result =
        await Api.delete(`/testimonials/${id}`);

    alert(result.message);

    loadTestimonials();

}