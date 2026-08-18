// ========================================
// EJAR SOLUTIONS - USERS MANAGEMENT
// ========================================

let editingUserId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadUsers();

    document
        .getElementById("userForm")
        .addEventListener("submit", saveUser);

});


// ========================================
// LOAD USERS
// ========================================

async function loadUsers() {

    try {

        const users = await Api.get("/users");

        const table =
            document.getElementById("usersTable");

        table.innerHTML = "";

        users.forEach(user => {

            table.innerHTML += `

            <tr>

                <td>${user.id}</td>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>

                    <span class="badge ${user.role === "admin"
                        ? "bg-success"
                        : "bg-primary"}">

                        ${user.role}

                    </span>

                </td>

                <td>

                    ${new Date(user.created_at).toLocaleDateString()}

                </td>

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

        // Edit Buttons

        document.querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    editUser(button.dataset.id);

                });

            });

        // Delete Buttons

        document.querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener("click", () => {

                    deleteUser(button.dataset.id);

                });

            });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load users.");

    }

}

// ========================================
// EDIT USER
// ========================================

async function editUser(id) {

    try {

        const user = await Api.get(`/users/${id}`);

        editingUserId = id;

        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

        document.getElementById("role").value =
            user.role;

        document.getElementById("form-submit").innerText =
            "Update User";

        new bootstrap.Modal(
            document.getElementById("userModal")
        ).show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load user.");

    }

}

// ========================================
// UPDATE USER
// ========================================

async function saveUser(e) {

    e.preventDefault();

    const user = {

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value,

        role:
            document.getElementById("role").value

    };

    try {

        const result = await Api.put(

            `/users/${editingUserId}`,

            user

        );

        alert(result.message);

        editingUserId = null;

        document.getElementById("userForm").reset();

        document.getElementById("form-submit").innerText =
            "Update User";

        bootstrap.Modal
            .getInstance(
                document.getElementById("userModal")
            )
            .hide();

        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to update user.");

    }

}

// ========================================
// DELETE USER
// ========================================

async function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {

        return;

    }

    try {

        const result = await Api.delete(`/users/${id}`);

        alert(result.message);

        loadUsers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete user.");

    }

}