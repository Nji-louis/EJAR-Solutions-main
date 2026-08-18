// ========================================
// EJAR - WHY CHOOSE US CMS
// ========================================

let editingFeature = null;

// ========================================
// INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeatures();

    document
        .getElementById("addFeature")
        .addEventListener("click", openCreateModal);

    document
        .getElementById("saveFeature")
        .addEventListener("click", saveFeature);

});

// ========================================
// LOAD FEATURES
// ========================================

async function loadFeatures(){

    try{

        const features = await Api.get("/homepage/why");

        const table = document.getElementById("featureTable");

        table.innerHTML = "";

        features.forEach(feature => {

            table.innerHTML += `

            <tr>

                <td>${feature.id}</td>

                <td><i class="${feature.icon}"></i></td>

                <td>

                    ${feature.image
                        ? `<img src="${API.assetUrl(feature.image)}"
                                 class="preview-image">`
                        : ""}

                </td>

                <td>${feature.title}</td>

                <td>${feature.status}</td>

                <td>${feature.sort_order}</td>

                <td>

                    <button class="btn btn-warning btn-sm edit-btn"
                            data-id="${feature.id}">

                        Edit

                    </button>

                    <button class="btn btn-danger btn-sm delete-btn"
                            data-id="${feature.id}">

                        Delete

                    </button>

                </td>

            </tr>`;

        });

        document.querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    editFeature(btn.dataset.id);

                });

            });

        document.querySelectorAll(".delete-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    deleteFeature(btn.dataset.id);

                });

            });

    }

    catch(err){

        console.error(err);

        alert("Unable to load features.");

    }

}

// ========================================
// OPEN CREATE MODAL
// ========================================

function openCreateModal(){

    editingFeature = null;

    document.getElementById("featureForm").reset();

    document.getElementById("featurePreview").style.display = "none";

    const modalElement =
        document.getElementById("featureModal");

    if (window.bootstrap && bootstrap.Modal) {

        const modal =
            new bootstrap.Modal(modalElement);

        modal.show();

    } else {

        console.error("Bootstrap not loaded");

        alert("Bootstrap failed to load. Please refresh the page.");

    }

}

// ========================================
// EDIT FEATURE
// ========================================

async function editFeature(id){

    try{

        const features = await Api.get("/homepage/why");

        const feature = features.find(f => f.id == id);

        editingFeature = id;

        document.getElementById("icon").value = feature.icon || "";
        document.getElementById("title").value = feature.title || "";
        document.getElementById("description").value = feature.description || "";
        document.getElementById("sort_order").value = feature.sort_order || 0;
        document.getElementById("status").value = feature.status || "active";

        const preview = document.getElementById("featurePreview");

        if(feature.image){

            preview.src = API.assetUrl(feature.image);
            preview.style.display = "block";

        }else{

            preview.style.display = "none";

        }

        new bootstrap.Modal(
            document.getElementById("featureModal")
        ).show();

    }

    catch(err){

        console.error(err);

    }

}

// ========================================
// SAVE FEATURE
// ========================================

async function saveFeature(){

    try{

        let image = "";

        // Keep old image if editing

        if(editingFeature !== null){

            const features = await Api.get("/homepage/why");
            const feature = features.find(f => f.id == editingFeature);

            if(feature){

                image = feature.image;

            }

        }

        // Upload new image

        const fileInput = document.getElementById("featureImage");

        if(fileInput.files.length > 0){

            const upload = await Api.upload(fileInput.files[0]);

            if(upload.success){

                image = upload.imageUrl;

            }else{

                alert(upload.message || "Image upload failed.");
                return;

            }

        }

        const data = {

            icon: document.getElementById("icon").value,
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            image,
            sort_order: document.getElementById("sort_order").value,
            status: document.getElementById("status").value

        };

        let result;

        if(editingFeature === null){

            result = await Api.post("/homepage/why", data);

        }else{

            result = await Api.put(
                `/homepage/why/${editingFeature}`,
                data
            );

        }

        alert(result.message);

        bootstrap.Modal
            .getInstance(
                document.getElementById("featureModal")
            )
            .hide();

        loadFeatures();

    }

    catch(err){

        console.error(err);

        alert("Unable to save feature.");

    }

}

// ========================================
// DELETE FEATURE
// ========================================

async function deleteFeature(id){

    if(!confirm("Delete this feature?")) return;

    try{

        const result = await Api.delete(`/homepage/why/${id}`);

        alert(result.message);

        loadFeatures();

    }

    catch(err){

        console.error(err);

        alert("Unable to delete feature.");

    }

}
