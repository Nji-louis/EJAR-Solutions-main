// ========================================
// EJAR - PARTNERS CMS
// ========================================

let editingPartner = null;

// ========================================
// INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadPartners();

    document
        .getElementById("addPartner")
        .addEventListener("click", openCreateModal);

    document
        .getElementById("savePartner")
        .addEventListener("click", savePartner);

});

// ========================================
// LOAD PARTNERS
// ========================================

async function loadPartners(){

    try{

        const partners = await Api.get("/homepage/partners");

        const table = document.getElementById("partnerTable");

        table.innerHTML = "";

        partners.forEach(partner => {

            table.innerHTML += `

            <tr>

                <td>${partner.id}</td>

                <td>

                    ${partner.logo
                        ? `<img src="${API.assetUrl(partner.logo)}"
                                 class="preview-image">`
                        : ""}

                </td>

                <td>${partner.name}</td>

                <td>
                    ${partner.website
                        ? `<a href="${partner.website}" target="_blank">${partner.website}</a>`
                        : ""}
                </td>

                <td>${partner.status}</td>

                <td>${partner.sort_order}</td>

                <td>

                    <button class="btn btn-warning btn-sm edit-btn"
                            data-id="${partner.id}">

                        Edit

                    </button>

                    <button class="btn btn-danger btn-sm delete-btn"
                            data-id="${partner.id}">

                        Delete

                    </button>

                </td>

            </tr>`;

        });

        document.querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    editPartner(btn.dataset.id);

                });

            });

        document.querySelectorAll(".delete-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    deletePartner(btn.dataset.id);

                });

            });

    }

    catch(err){

        console.error(err);

        alert("Unable to load partners.");

    }

}

// ========================================
// OPEN CREATE MODAL
// ========================================

function openCreateModal(){

    editingPartner = null;

    document.getElementById("partnerForm").reset();

    document.getElementById("partnerPreview").style.display = "none";

    const modal =
        new bootstrap.Modal(
            document.getElementById("partnerModal")
        );

    modal.show();

}

// ========================================
// EDIT PARTNER
// ========================================

async function editPartner(id){

    try{

        const partners = await Api.get("/homepage/partners");

        const partner = partners.find(p => p.id == id);

        editingPartner = id;

        document.getElementById("name").value = partner.name || "";
        document.getElementById("website").value = partner.website || "";
        document.getElementById("sort_order").value = partner.sort_order || 0;
        document.getElementById("status").value = partner.status || "active";

        const preview = document.getElementById("partnerPreview");

        if(partner.logo){

            preview.src = API.assetUrl(partner.logo);
            preview.style.display = "block";

        }else{

            preview.style.display = "none";

        }

        const modal =
            new bootstrap.Modal(
                document.getElementById("partnerModal")
            );

        modal.show();

    }

    catch(err){

        console.error(err);

    }

}

// ========================================
// SAVE PARTNER
// ========================================

async function savePartner(){

    try{

        let logo = "";

        // Keep old logo when editing

        if(editingPartner !== null){

            const partners = await Api.get("/homepage/partners");
            const partner = partners.find(p => p.id == editingPartner);

            if(partner){

                logo = partner.logo;

            }

        }

        // Upload new logo

        const fileInput = document.getElementById("partnerLogo");

        if(fileInput.files.length > 0){

            const upload = await Api.upload(fileInput.files[0]);

            if(upload.success){

                logo = upload.imageUrl;

            }else{

                alert(upload.message || "Logo upload failed.");
                return;

            }

        }

        const data = {

            name: document.getElementById("name").value,
            website: document.getElementById("website").value,
            logo,
            sort_order: document.getElementById("sort_order").value,
            status: document.getElementById("status").value

        };

        let result;

        if(editingPartner === null){

            result = await Api.post("/homepage/partners", data);

        }else{

            result = await Api.put(
                `/homepage/partners/${editingPartner}`,
                data
            );

        }

        alert(result.message);

        bootstrap.Modal
            .getInstance(
                document.getElementById("partnerModal")
            )
            .hide();

        loadPartners();

    }

    catch(err){

        console.error(err);

        alert("Unable to save partner.");

    }

}

// ========================================
// DELETE PARTNER
// ========================================

async function deletePartner(id){

    if(!confirm("Delete this partner?")) return;

    try{

        const result = await Api.delete(`/homepage/partners/${id}`);

        alert(result.message);

        loadPartners();

    }

    catch(err){

        console.error(err);

        alert("Unable to delete partner.");

    }

}
