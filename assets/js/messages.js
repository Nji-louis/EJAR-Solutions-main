// ========================================
// EJAR SOLUTIONS - MESSAGES MANAGEMENT
// ========================================

let currentMessageId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadMessages();

});

// ========================================
// LOAD ALL MESSAGES
// ========================================

async function loadMessages() {

    try {

        const messages = await Api.get("/messages");

        const table = document.getElementById("messagesTable");

        table.innerHTML = "";

        messages.forEach(message => {

            let badge = "";

            if (message.status === "new") {

                badge = '<span class="badge bg-warning text-dark">New</span>';

            } else if (message.status === "read") {

                badge = '<span class="badge bg-primary">Read</span>';

            } else {

                badge = '<span class="badge bg-success">Replied</span>';

            }

            table.innerHTML += `

            <tr>

                <td>${message.id}</td>

                <td>${message.name}</td>

                <td>${message.email}</td>

                <td>${message.subject}</td>

                <td>${badge}</td>

                <td>${new Date(message.created_at).toLocaleDateString()}</td>

                <td>

                    <button
                        class="btn btn-info btn-sm view-btn"
                        data-id="${message.id}">

                        View

                    </button>

                    <button
                        class="btn btn-danger btn-sm delete-btn"
                        data-id="${message.id}">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        // Attach View events

        document.querySelectorAll(".view-btn").forEach(button => {

            button.addEventListener("click", () => {

                viewMessage(button.dataset.id);

            });

        });

        // Attach Delete events

        document.querySelectorAll(".delete-btn").forEach(button => {

            button.addEventListener("click", () => {

                deleteMessage(button.dataset.id);

            });

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load messages.");

    }

}

// ========================================
// VIEW MESSAGE
// ========================================

async function viewMessage(id) {

    try {

        const message = await Api.get(`/messages/${id}`);

        currentMessageId = id;

        document.getElementById("viewName").innerText =
            message.name;

        document.getElementById("viewEmail").innerText =
            message.email;

        document.getElementById("viewPhone").innerText =
            message.phone || "-";

        document.getElementById("viewSubject").innerText =
            message.subject;

        document.getElementById("viewMessage").innerText =
            message.message;

        document.getElementById("messageStatus").value =
            message.status;

        new bootstrap.Modal(
            document.getElementById("messageModal")
        ).show();

    }

    catch (error) {

        console.error(error);

        alert("Unable to load message.");

    }

}

// ========================================
// UPDATE STATUS
// ========================================

document
.getElementById("updateStatusBtn")
.addEventListener("click", updateStatus);

async function updateStatus() {

    try {

        const status =
            document.getElementById("messageStatus").value;

        const result = await Api.put(

            `/messages/${currentMessageId}`,

            {
                status
            }

        );

        alert(result.message);

        bootstrap.Modal
            .getInstance(
                document.getElementById("messageModal")
            )
            .hide();

        loadMessages();

    }

    catch (error) {

        console.error(error);

        alert("Unable to update message.");

    }

}

// ========================================
// DELETE MESSAGE
// ========================================

async function deleteMessage(id) {

    if (!confirm("Delete this message?")) {
        return;
    }

    try {

        const result =
            await Api.delete(`/messages/${id}`);

        alert(result.message);

        loadMessages();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete message.");

    }

}