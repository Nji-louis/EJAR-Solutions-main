// ========================================
// EJAR SOLUTIONS - USERS MANAGEMENT
// ========================================

let editingUserId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadUsers();

    document
        .getElementById("userForm")
        .addEventListener("submit", saveUser);

    document
        .getElementById("addUserBtn")
        .addEventListener("click", openAddUserModal);

});


// ========================================
// OPEN ADD USER MODAL
// ========================================

function openAddUserModal() {

    editingUserId = null;

    document.getElementById("userModalTitle").innerText =
    "Edit User";

    document.getElementById("userForm").reset();

    document.getElementById("userModalTitle").innerText =
    "Invite User";

    document.getElementById("form-submit").innerText =
    "Send Invitation";
        

    new bootstrap.Modal(
        document.getElementById("userModal")
    ).show();

}


// ========================================
// LOAD USERS
// ========================================

async function loadUsers() {

    try {

        const users = await Api.get("/users");

        const table =
            document.getElementById("usersTable");

        table.innerHTML = "";

        if (!Array.isArray(users)) {

            alert(
                users.message ||
                "Unable to load users."
            );

            return;
        }

        users.forEach(user => {

            const joined = user.created_at
                ? new Date(
                    user.created_at
                ).toLocaleDateString()
                : "-";

            table.innerHTML += `

                <tr>

                    <td>${user.id}</td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>
                        <span class="badge ${
                            user.role === "admin"
                                ? "bg-success"
                                : "bg-primary"
                        }">
                            ${user.role}
                        </span>
                    </td>

                    <td>${joined}</td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm edit-btn"
                            data-id="${user.id}">

                            Edit

                        </button>

                        <button
                            class="btn btn-danger btn-sm delete-btn"
                            data-id="${user.id}">

                            Delete

                        </button>

                    </td>

                </tr>
            `;

        });


        document
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        editUser(
                            button.dataset.id
                        );
                    }
                );

            });


        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        deleteUser(
                            button.dataset.id
                        );
                    }
                );

            });

    }

    catch (error) {

        console.error(
            "Load Users Error:",
            error
        );

        alert("Unable to load users.");

    }

}





// ========================================
// EDIT USER
// ========================================

async function editUser(id) {

    try {

        const user =
            await Api.get(`/users/${id}`);

        if (!user || !user.id) {

            alert(
                user.message ||
                "Unable to load user."
            );

            return;
        }

        editingUserId = id;

        document.getElementById("userModalTitle").innerText =
    "Edit User";

        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

        document.getElementById("role").value =
            user.role;

        document.getElementById("userModalTitle").innerText =
            "Edit User";

        document.getElementById("form-submit").innerHTML =
            '<i class="bi bi-check-circle-fill"></i> Update User';

        new bootstrap.Modal(
            document.getElementById("userModal")
        ).show();

    }

    catch (error) {

        console.error(
            "Edit User Error:",
            error
        );

        alert("Unable to load user.");

    }

}


// ========================================
// CREATE / UPDATE USER
// ========================================

async function saveUser(e) {

    e.preventDefault();

    const name =
        document.getElementById("name")
            .value.trim();

    const email =
        document.getElementById("email")
            .value.trim();

    const role =
        document.getElementById("role")
            .value;

    try {

        let result;


        // =========================
        // CREATE NEW USER
        // =========================

        if (!editingUserId) {

            result = await Api.post(
                "/users",
                {
                    name,
                    email,
                    role
                }
            );

        }


        // =========================
        // UPDATE EXISTING USER
        // =========================

        else {

            result = await Api.put(
                `/users/${editingUserId}`,
                {
                    name,
                    email,
                    role
                }
            );

        }


        if (!result.success) {

            alert(
                result.message ||
                "Unable to save user."
            );

            return;

        }


        alert(result.message);

        editingUserId = null;

        document
            .getElementById("userForm")
            .reset();

        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    "userModal"
                )
            );

        if (modal) {
            modal.hide();
        }

        loadUsers();

    }

    catch (error) {

        console.error(
            "Save User Error:",
            error
        );

        alert("Unable to save user.");

    }

}


// ========================================
// DELETE USER
// ========================================

async function deleteUser(id) {

    if (
        !confirm(
            "Are you sure you want to delete this user?"
        )
    ) {
        return;
    }

    try {

        const result =
            await Api.delete(`/users/${id}`);

        if (!result.success) {

            alert(
                result.message ||
                "Unable to delete user."
            );

            return;
        }

        alert(result.message);

        loadUsers();

    }

    catch (error) {

        console.error(
            "Delete User Error:",
            error
        );

        alert("Unable to delete user.");

    }

}


async function saveUser(e) {

    e.preventDefault();

    const user = {

        name:
            document.getElementById("name").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        role:
            document.getElementById("role").value

    };


    try {

        let result;

        if (editingUserId) {

            result = await Api.put(
                `/users/${editingUserId}`,
                user
            );

        } else {

            result = await Api.post(
                "/users",
                user
            );

        }

        if (result.success === false) {
            alert(result.message || "Operation failed.");
            return;
        }

        alert(result.message);

        editingUserId = null;

        document
            .getElementById("userForm")
            .reset();

        bootstrap.Modal
            .getInstance(
                document.getElementById("userModal")
            )
            .hide();

        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save user.");

    }

}