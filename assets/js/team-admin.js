"use strict";

// =====================================================
// TEAM ADMIN
// =====================================================

let editingId = null;
let imageUrl = "";


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Team Admin initialized.");

    const form = document.getElementById("teamForm");

    if (form) {
        form.addEventListener("submit", saveTeam);
    }

    const imageInput = document.getElementById("imageFile");

    if (imageInput) {
        imageInput.addEventListener("change", handleImageUpload);
    }

    const addButton = document.getElementById("addTeamBtn");

    if (addButton) {
        addButton.addEventListener("click", () => {
            resetTeamForm();
        });
    }

    const modalElement = document.getElementById("teamModal");

    if (modalElement) {

        modalElement.addEventListener(
            "hidden.bs.modal",
            () => {

                if (!editingId) {
                    resetTeamForm();
                }

            }
        );

    }

    loadTeam();

});


// =====================================================
// LOAD TEAM MEMBERS
// =====================================================

async function loadTeam() {

    const table = document.getElementById("teamTable");

    if (!table) {
        console.error("teamTable element was not found.");
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                <div class="spinner-border spinner-border-sm me-2"></div>
                Loading team members...
            </td>
        </tr>
    `;

    try {

        console.log("Loading admin team...");

        const result = await Api.get("/team");

        console.log("Admin team API response:", result);

        /*
         * Backend returns:
         *
         * [
         *   {
         *      id,
         *      name,
         *      role,
         *      ...
         *   }
         * ]
         *
         * Therefore result itself must be an array.
         */

        if (!Array.isArray(result)) {

            console.error(
                "Unexpected team API response:",
                result
            );

            throw new Error(
                result?.message ||
                "Invalid team API response."
            );
        }


        // =================================================
        // EMPTY TEAM
        // =================================================

        if (result.length === 0) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="text-center text-muted py-4"
                    >
                        <i class="bi bi-people fs-3 d-block mb-2"></i>
                        No team members found.
                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // DISPLAY TEAM
        // =================================================

        table.innerHTML = result
            .map(member => {

                const id =
                    member.id ?? "";

                const name =
                    escapeHtml(member.name);

                const role =
                    escapeHtml(member.role);

                const department =
                    escapeHtml(
                        member.department || "-"
                    );

                const order =
                    member.sort_order ?? 0;

                const status =
                    member.status || "active";


                const statusBadge =
                    status === "active"
                        ? `
                            <span class="badge bg-success">
                                Active
                            </span>
                          `
                        : `
                            <span class="badge bg-secondary">
                                Inactive
                            </span>
                          `;


                // -----------------------------------------
                // IMAGE
                // -----------------------------------------

                let imageHtml = `
                    <div
                        class="d-flex align-items-center justify-content-center
                               bg-light rounded"
                        style="
                            width:70px;
                            height:70px;
                            overflow:hidden;
                        "
                    >
                        <i class="bi bi-person fs-3 text-muted"></i>
                    </div>
                `;


                if (member.image) {

                    const image =
                        escapeHtml(
                            API.assetUrl(member.image)
                        );

                    imageHtml = `
                        <img
                            src="${image}"
                            alt="${name}"
                            class="img-thumbnail"
                            style="
                                width:70px;
                                height:70px;
                                object-fit:cover;
                            "
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='flex';
                            "
                        >

                        <div
                            class="align-items-center justify-content-center
                                   bg-light rounded"
                            style="
                                width:70px;
                                height:70px;
                                display:none;
                            "
                        >
                            <i class="bi bi-person fs-3 text-muted"></i>
                        </div>
                    `;

                }


                return `
                    <tr>

                        <td>
                            ${id}
                        </td>

                        <td>
                            ${imageHtml}
                        </td>

                        <td>
                            <strong>
                                ${name}
                            </strong>
                        </td>

                        <td>
                            ${role}
                        </td>

                        <td>
                            ${department}
                        </td>

                        <td>
                            ${order}
                        </td>

                        <td>
                            ${statusBadge}
                        </td>

                        <td>

                            <div class="d-flex gap-1">

                                <button
                                    type="button"
                                    class="btn btn-sm btn-primary"
                                    onclick="editTeam(${Number(id)})"
                                    title="Edit team member"
                                >
                                    <i class="bi bi-pencil"></i>
                                </button>

                                <button
                                    type="button"
                                    class="btn btn-sm btn-danger"
                                    onclick="deleteTeam(${Number(id)})"
                                    title="Delete team member"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            })
            .join("");

    }
    catch (error) {

        console.error(
            "Load Team Error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center text-danger py-4"
                >
                    <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>

                    Unable to load team members.

                    <br>

                    <small>
                        ${escapeHtml(error?.message || "Unknown error")}
                    </small>
                </td>
            </tr>
        `;

    }

}


// =====================================================
// IMAGE UPLOAD
// =====================================================

async function handleImageUpload(event) {

    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }


    // ---------------------------------------------
    // VALIDATE FILE
    // ---------------------------------------------

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select a valid image file."
        );

        event.target.value = "";

        return;
    }


    try {

        console.log(
            "Uploading team image:",
            file.name
        );


        const result =
            await Api.upload(file);


        console.log(
            "Image upload response:",
            result
        );


        imageUrl =
            result?.imageUrl ||
            result?.url ||
            result?.image ||
            result?.path ||
            "";


        if (!imageUrl) {

            console.error(
                "No image URL returned:",
                result
            );

            throw new Error(
                result?.message ||
                "The server did not return an image URL."
            );

        }


        // ---------------------------------------------
        // PREVIEW
        // ---------------------------------------------

        const preview =
            document.getElementById(
                "imagePreview"
            );


        if (preview) {

            preview.src =
                API.assetUrl(imageUrl);

            preview.style.display =
                "block";

        }


        console.log(
            "Team image URL:",
            imageUrl
        );

    }
    catch (error) {

        console.error(
            "Team Image Upload Error:",
            error
        );

        imageUrl = "";

        event.target.value = "";

        alert(
            error?.message ||
            "Unable to upload team image."
        );

    }

}


// =====================================================
// SAVE TEAM MEMBER
// =====================================================

async function saveTeam(event) {

    event.preventDefault();


    // ---------------------------------------------
    // FORM ELEMENTS
    // ---------------------------------------------

    const nameElement =
        document.getElementById("name");

    const roleElement =
        document.getElementById("role");

    const departmentElement =
        document.getElementById("department");

    const descriptionElement =
        document.getElementById("description");

    const phoneElement =
        document.getElementById("phone");

    const emailElement =
        document.getElementById("email");

    const skillsElement =
        document.getElementById("skills");

    const sortOrderElement =
        document.getElementById("sort_order");

    const statusElement =
        document.getElementById("status");


    // ---------------------------------------------
    // VALUES
    // ---------------------------------------------

    const name =
        nameElement?.value.trim() || "";

    const role =
        roleElement?.value.trim() || "";

    const department =
        departmentElement?.value.trim() || "";

    const description =
        descriptionElement?.value.trim() || "";

    const phone =
        phoneElement?.value.trim() || "";

    const email =
        emailElement?.value.trim() || "";

    const skillsInput =
        skillsElement?.value.trim() || "";

    const sortOrderValue =
        sortOrderElement?.value ?? "0";

    const status =
        statusElement?.value || "active";


    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!name) {

        alert(
            "Please enter the team member's name."
        );

        nameElement?.focus();

        return;
    }


    if (!role) {

        alert(
            "Please enter the team member's role."
        );

        roleElement?.focus();

        return;
    }


    if (!description) {

        alert(
            "Please enter a description."
        );

        descriptionElement?.focus();

        return;
    }


    // ---------------------------------------------
    // SKILLS
    // ---------------------------------------------

    const skills =
        skillsInput
            ? skillsInput
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean)
            : [];


    // ---------------------------------------------
    // SORT ORDER
    // ---------------------------------------------

    const parsedSortOrder =
        Number(sortOrderValue);

    const sortOrder =
        Number.isInteger(parsedSortOrder) &&
        parsedSortOrder >= 0
            ? parsedSortOrder
            : 0;


    // ---------------------------------------------
    // PAYLOAD
    // ---------------------------------------------

    const data = {

        name,

        role,

        department:
            department || null,

        description,

        image:
            imageUrl || null,

        skills,

        phone:
            phone || null,

        email:
            email || null,

        sort_order:
            sortOrder,

        status:
            status === "inactive"
                ? "inactive"
                : "active"

    };


    console.log(
        "Team save payload:",
        data
    );


    // ---------------------------------------------
    // SUBMIT BUTTON
    // ---------------------------------------------

    const submitButton =
        document.getElementById(
            "formSubmit"
        );


    const originalButtonText =
        submitButton?.innerHTML || "";


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.innerHTML = `
            <span
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true">
            </span>
            Saving...
        `;

    }


    try {

        let result;


        const currentEditingId =
            editingId;


        // ---------------------------------------------
        // UPDATE
        // ---------------------------------------------

        if (currentEditingId !== null) {

            console.log(
                "Updating team member:",
                currentEditingId
            );


            result =
                await Api.put(
                    `/team/${currentEditingId}`,
                    data
                );

        }


        // ---------------------------------------------
        // CREATE
        // ---------------------------------------------

        else {

            console.log(
                "Creating team member"
            );


            result =
                await Api.post(
                    "/team",
                    data
                );

        }


        console.log(
            "Team save response:",
            result
        );


        // ---------------------------------------------
        // API ERROR
        // ---------------------------------------------

        if (
            !result ||
            result.success === false
        ) {

            throw new Error(
                result?.message ||
                "Unable to save team member."
            );

        }


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        alert(
            result.message ||
            (
                currentEditingId !== null
                    ? "Team member updated successfully."
                    : "Team member created successfully."
            )
        );


        // ---------------------------------------------
        // CLOSE MODAL
        // ---------------------------------------------

        const modalElement =
            document.getElementById(
                "teamModal"
            );


        if (
            modalElement &&
            typeof bootstrap !== "undefined"
        ) {

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                ) ||
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );


            modal.hide();

        }


        // ---------------------------------------------
        // RESET
        // ---------------------------------------------

        resetTeamForm();


        // ---------------------------------------------
        // RELOAD
        // ---------------------------------------------

        await loadTeam();

    }
    catch (error) {

        console.error(
            "Save Team Error:",
            error
        );


        alert(
            error?.message ||
            "Unable to save team member."
        );

    }
    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonText ||
                `
                    <i class="bi bi-plus-circle"></i>
                    Save Team Member
                `;

        }

    }

}


// =====================================================
// EDIT TEAM MEMBER
// =====================================================

async function editTeam(id) {

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {

        alert(
            "Invalid team member ID."
        );

        return;
    }


    try {

        console.log(
            "Loading team member:",
            id
        );


        const item =
            await Api.get(
                `/team/${encodeURIComponent(id)}`
            );


        console.log(
            "Edit team response:",
            item
        );


        if (
            !item ||
            item.success === false
        ) {

            throw new Error(
                item?.message ||
                "Unable to load team member."
            );

        }


        // ---------------------------------------------
        // EDITING STATE
        // ---------------------------------------------

        editingId =
            Number(id);


        // ---------------------------------------------
        // IMAGE
        // ---------------------------------------------

        imageUrl =
            item.image || "";


        // ---------------------------------------------
        // FIELDS
        // ---------------------------------------------

        setValue(
            "name",
            item.name
        );

        setValue(
            "role",
            item.role
        );

        setValue(
            "department",
            item.department || ""
        );

        setValue(
            "description",
            item.description || ""
        );

        setValue(
            "phone",
            item.phone || ""
        );

        setValue(
            "email",
            item.email || ""
        );

        setValue(
            "sort_order",
            item.sort_order ?? 0
        );

        setValue(
            "status",
            item.status || "active"
        );


        // ---------------------------------------------
        // SKILLS
        // ---------------------------------------------

        const skills =
            parseSkills(item.skills);


        setValue(
            "skills",
            skills.join(", ")
        );


        // ---------------------------------------------
        // IMAGE PREVIEW
        // ---------------------------------------------

        const preview =
            document.getElementById(
                "imagePreview"
            );


        if (preview) {

            if (item.image) {

                preview.src =
                    API.assetUrl(item.image);

                preview.style.display =
                    "block";

            }
            else {

                preview.removeAttribute(
                    "src"
                );

                preview.style.display =
                    "none";

            }

        }


        // ---------------------------------------------
        // MODAL TITLE
        // ---------------------------------------------

        const modalTitle =
            document.getElementById(
                "teamModalTitle"
            );


        if (modalTitle) {

            modalTitle.innerHTML = `
                <i class="bi bi-pencil-square"></i>
                Edit Team Member
            `;

        }


        // ---------------------------------------------
        // SUBMIT BUTTON
        // ---------------------------------------------

        const submitButton =
            document.getElementById(
                "formSubmit"
            );


        if (submitButton) {

            submitButton.innerHTML = `
                <i class="bi bi-check-circle"></i>
                Update Team Member
            `;

        }


        // ---------------------------------------------
        // SHOW MODAL
        // ---------------------------------------------

        const modalElement =
            document.getElementById(
                "teamModal"
            );


        if (
            !modalElement ||
            typeof bootstrap === "undefined"
        ) {

            throw new Error(
                "Team modal or Bootstrap is not available."
            );

        }


        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );


        modal.show();

    }
    catch (error) {

        console.error(
            "Edit Team Error:",
            error
        );


        alert(
            error?.message ||
            "Unable to load team member."
        );

    }

}


// =====================================================
// DELETE TEAM MEMBER
// =====================================================

async function deleteTeam(id) {

    if (
        id === null ||
        id === undefined ||
        id === ""
    ) {

        alert(
            "Invalid team member ID."
        );

        return;
    }


    const confirmed =
        window.confirm(
            "Are you sure you want to delete this team member?"
        );


    if (!confirmed) {
        return;
    }


    try {

        console.log(
            "Deleting team member:",
            id
        );


        const result =
            await Api.delete(
                `/team/${encodeURIComponent(id)}`
            );


        console.log(
            "Delete response:",
            result
        );


        if (
            !result ||
            result.success === false
        ) {

            throw new Error(
                result?.message ||
                "Unable to delete team member."
            );

        }


        alert(
            result.message ||
            "Team member deleted successfully."
        );


        await loadTeam();

    }
    catch (error) {

        console.error(
            "Delete Team Error:",
            error
        );


        alert(
            error?.message ||
            "Unable to delete team member."
        );

    }

}


// =====================================================
// RESET TEAM FORM
// =====================================================

function resetTeamForm() {

    editingId = null;

    imageUrl = "";


    // ---------------------------------------------
    // RESET FORM
    // ---------------------------------------------

    const form =
        document.getElementById(
            "teamForm"
        );


    if (form) {
        form.reset();
    }


    // ---------------------------------------------
    // DEFAULT STATUS
    // ---------------------------------------------

    const status =
        document.getElementById(
            "status"
        );


    if (status) {
        status.value = "active";
    }


    // ---------------------------------------------
    // DEFAULT ORDER
    // ---------------------------------------------

    const sortOrder =
        document.getElementById(
            "sort_order"
        );


    if (sortOrder) {
        sortOrder.value = "0";
    }


    // ---------------------------------------------
    // IMAGE INPUT
    // ---------------------------------------------

    const imageFile =
        document.getElementById(
            "imageFile"
        );


    if (imageFile) {
        imageFile.value = "";
    }


    // ---------------------------------------------
    // IMAGE PREVIEW
    // ---------------------------------------------

    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (preview) {

        preview.removeAttribute(
            "src"
        );

        preview.style.display =
            "none";

    }


    // ---------------------------------------------
    // MODAL TITLE
    // ---------------------------------------------

    const modalTitle =
        document.getElementById(
            "teamModalTitle"
        );


    if (modalTitle) {

        modalTitle.innerHTML = `
            <i class="bi bi-person-plus"></i>
            Add Team Member
        `;

    }


    // ---------------------------------------------
    // SUBMIT BUTTON
    // ---------------------------------------------

    const submitButton =
        document.getElementById(
            "formSubmit"
        );


    if (submitButton) {

        submitButton.innerHTML = `
            <i class="bi bi-plus-circle"></i>
            Save Team Member
        `;

        submitButton.disabled = false;

    }

}


// =====================================================
// PARSE SKILLS
// =====================================================

function parseSkills(skills) {

    if (!skills) {
        return [];
    }


    // ---------------------------------------------
    // ARRAY
    // ---------------------------------------------

    if (Array.isArray(skills)) {

        return skills
            .map(skill => String(skill).trim())
            .filter(Boolean);

    }


    // ---------------------------------------------
    // STRING
    // ---------------------------------------------

    if (typeof skills === "string") {

        try {

            const parsed =
                JSON.parse(skills);


            if (Array.isArray(parsed)) {

                return parsed
                    .map(skill => String(skill).trim())
                    .filter(Boolean);

            }

        }
        catch (error) {

            // Not JSON.
            // Use comma-separated fallback.

        }


        return skills
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean);

    }


    return [];

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// SET FORM VALUE
// =====================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value ?? "";

    }

}