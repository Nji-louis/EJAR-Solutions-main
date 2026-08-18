// ========================================
// EJAR SOLUTIONS - SERVICES MANAGEMENT
// ========================================


// assets/js/services.js
// ========================================
// EJAR SOLUTIONS - SERVICES MANAGEMENT
// ========================================

let editingServiceId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadServices();

    const form = document.getElementById("serviceForm");

    form.addEventListener("submit", saveService);

});

// ========================================
// LOAD SERVICES
// ========================================

async function loadServices() {

    try {

        const services = await Api.get("/services");

        const table = document.getElementById("servicesTable");

        table.innerHTML = "";

        services.forEach(service => {

            table.innerHTML += `
            <tr>
                <td>${service.id}</td>

                <td>${service.title}</td>

                <td>${service.slug || ""}</td>

                <td>
                    <img
                        src="${API.assetUrl(service.image)}"
                        width="70"
                        height="50"
                        style="object-fit:cover;border-radius:6px;">
                </td>

                <td>
                    <span class="badge ${service.status === "active" ? "bg-success" : "bg-secondary"}">
                        ${service.status}
                    </span>
                </td>

                <td>${new Date(service.created_at).toLocaleDateString()}</td>

                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${service.id}">Edit</button>

                    <button class="btn btn-danger btn-sm delete-btn" data-id="${service.id}">Delete</button>
                </td>
            </tr>
            `;

        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => editService(button.dataset.id));
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => deleteService(button.dataset.id));
        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load services.");

    }

}

// ========================================
// SAVE SERVICE
// ========================================

async function saveService(e) {

    e.preventDefault();

    try {

        let imageUrl = "";

        const imageFile = document.getElementById("image").files[0];

        // Upload image if selected
        if (imageFile) {

            const uploadResult = await Api.upload(imageFile);

            if (!uploadResult.success) {

                alert(uploadResult.message);

                return;

            }

            imageUrl = uploadResult.imageUrl;

        }

        const service = {

            title: document.getElementById("title").value,

            slug: document.getElementById("slug").value,

            short_description:
                document.getElementById("short_description").value,

            description:
                document.getElementById("description").value,

            icon:
                document.getElementById("icon").value,

            image: imageUrl,

            status:
                document.getElementById("status").value

        };

        let result;

        if (editingServiceId) {

            result = await Api.put(`/services/${editingServiceId}`, service);

        } else {

            result = await Api.post("/services", service);

        }

        alert(result.message);

        document.getElementById("serviceForm").reset();

        editingServiceId = null;

        document.getElementById("form-submit").innerText =
            "Save Service";

        bootstrap.Modal.getInstance(
            document.getElementById("serviceModal")
        ).hide();

        loadServices();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save service.");

    }

}

// ========================================
// EDIT SERVICE
// ========================================

async function editService(id) {

    try {

        const service = await Api.get(`/services/${id}`);

        editingServiceId = id;

        document.getElementById("title").value = service.title;

        document.getElementById("slug").value = service.slug || "";

        document.getElementById("short_description").value =
            service.short_description || "";

        document.getElementById("description").value =
            service.description || "";

        document.getElementById("icon").value =
            service.icon || "";

        document.getElementById("status").value =
            service.status || "active";

        document.getElementById("form-submit").innerText =
            "Update Service";

        new bootstrap.Modal(
            document.getElementById("serviceModal")
        ).show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load service.");

    }

}

// ========================================
// DELETE SERVICE
// ========================================

async function deleteService(id) {

    if (!confirm("Are you sure you want to delete this service?")) {

        return;

    }

    try {

        const result = await Api.delete(`/services/${id}`);

        alert(result.message);

        loadServices();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete service.");

    }

}
