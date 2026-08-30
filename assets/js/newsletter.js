// ========================================
// EJAR SOLUTIONS - NEWSLETTER MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadSubscribers();

});


// ========================================
// LOAD ALL SUBSCRIBERS
// ========================================

async function loadSubscribers() {

    try {

        const subscribers = await Api.get("/newsletter");

        const table =
            document.getElementById("newsletterTable");

        table.innerHTML = "";

        if (!subscribers || subscribers.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">
                        No newsletter subscribers yet.
                    </td>
                </tr>
            `;

            return;

        }

        subscribers.forEach(subscriber => {

            table.innerHTML += `

                <tr>

                    <td>${subscriber.id}</td>

                    <td>${subscriber.email}</td>

                    <td>
                        ${new Date(
                            subscriber.created_at
                        ).toLocaleDateString()}
                    </td>

                    <td>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteSubscriber(${subscriber.id})">

                            <i class="bi bi-trash"></i>
                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load newsletter subscribers.");

    }

}


// ========================================
// DELETE SUBSCRIBER
// ========================================

async function deleteSubscriber(id) {

    if (!confirm(
        "Are you sure you want to delete this subscriber?"
    )) {

        return;

    }

    try {

        const result =
            await Api.delete(`/newsletter/${id}`);

        alert(result.message);

        loadSubscribers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete subscriber.");

    }

}