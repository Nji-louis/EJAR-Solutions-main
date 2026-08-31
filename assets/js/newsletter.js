// ========================================
// EJAR SOLUTIONS - NEWSLETTER MANAGEMENT
// ========================================

let newsletterSubscribers = [];


// ========================================
// INITIALIZE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadSubscribers();

    const refreshButton =
        document.getElementById("refreshNewsletterBtn");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadSubscribers
        );

    }


    const exportButton =
        document.getElementById("exportCsvBtn");

    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportSubscribersCSV
        );

    }


    const sendForm =
        document.getElementById("newsletterSendForm");

    if (sendForm) {

        sendForm.addEventListener(
            "submit",
            sendNewsletter
        );

    }

});


// ========================================
// LOAD ALL SUBSCRIBERS
// ========================================

async function loadSubscribers() {

    const table =
        document.getElementById("newsletterTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="4" class="text-center">
                Loading subscribers...
            </td>
        </tr>
    `;

    try {

        const result =
            await Api.get("/newsletter");

        /*
         * The backend currently returns the array
         * directly.
         *
         * We also support { subscribers: [] }
         * in case the backend response is changed later.
         */

        if (Array.isArray(result)) {

            newsletterSubscribers = result;

        } else if (
            result &&
            Array.isArray(result.subscribers)
        ) {

            newsletterSubscribers = result.subscribers;

        } else {

            newsletterSubscribers = [];

        }


        // Update subscriber count

        const count =
            document.getElementById("subscriberCount");

        if (count) {

            count.textContent =
                newsletterSubscribers.length;

        }


        // Empty state

        if (newsletterSubscribers.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="text-center text-muted">

                        No newsletter subscribers yet.

                    </td>
                </tr>
            `;

            return;

        }


        // Display subscribers

        table.innerHTML = "";


        newsletterSubscribers.forEach(
            subscriber => {

                const row =
                    document.createElement("tr");


                const idCell =
                    document.createElement("td");

                idCell.textContent =
                    subscriber.id;


                const emailCell =
                    document.createElement("td");

                emailCell.textContent =
                    subscriber.email;


                const dateCell =
                    document.createElement("td");

                dateCell.textContent =
                    subscriber.created_at
                        ? new Date(
                            subscriber.created_at
                          ).toLocaleDateString()
                        : "-";


                const actionCell =
                    document.createElement("td");


                const deleteButton =
                    document.createElement("button");

                deleteButton.className =
                    "btn btn-danger btn-sm";


                deleteButton.innerHTML =
                    `<i class="bi bi-trash"></i> Delete`;


                deleteButton.addEventListener(
                    "click",
                    () => deleteSubscriber(
                        subscriber.id
                    )
                );


                actionCell.appendChild(
                    deleteButton
                );


                row.appendChild(idCell);
                row.appendChild(emailCell);
                row.appendChild(dateCell);
                row.appendChild(actionCell);


                table.appendChild(row);

            }
        );

    }

    catch (error) {

        console.error(
            "Newsletter Load Error:",
            error
        );

        newsletterSubscribers = [];


        const count =
            document.getElementById(
                "subscriberCount"
            );

        if (count) {
            count.textContent = "0";
        }


        table.innerHTML = `
            <tr>
                <td colspan="4"
                    class="text-center text-danger">

                    Unable to load newsletter subscribers.

                </td>
            </tr>
        `;

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
            await Api.delete(
                `/newsletter/${id}`
            );


        if (result.success) {

            alert(
                result.message ||
                "Subscriber deleted successfully."
            );

            await loadSubscribers();

        } else {

            alert(
                result.message ||
                "Unable to delete subscriber."
            );

        }

    }

    catch (error) {

        console.error(
            "Newsletter Delete Error:",
            error
        );

        alert(
            "Unable to delete subscriber."
        );

    }

}


// ========================================
// EXPORT SUBSCRIBERS TO CSV
// ========================================

function exportSubscribersCSV() {

    if (
        !newsletterSubscribers ||
        newsletterSubscribers.length === 0
    ) {

        alert(
            "There are no subscribers to export."
        );

        return;

    }


    let csv =
        "ID,Email,Subscribed Date\n";


    newsletterSubscribers.forEach(
        subscriber => {

            const id =
                subscriber.id || "";


            const email =
                String(
                    subscriber.email || ""
                ).replace(
                    /"/g,
                    '""'
                );


            const date =
                subscriber.created_at
                    ? new Date(
                        subscriber.created_at
                      ).toLocaleDateString()
                    : "";


            csv +=
                `${id},"${email}","${date}"\n`;

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        "ejar-newsletter-subscribers.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// ========================================
// SEND NEWSLETTER
// ========================================

async function sendNewsletter(event) {

    event.preventDefault();


    const subjectInput =
        document.getElementById(
            "newsletterSubject"
        );


    const messageInput =
        document.getElementById(
            "newsletterMessage"
        );


    const sendButton =
        document.getElementById(
            "sendNewsletterBtn"
        );


    const resultBox =
        document.getElementById(
            "newsletterSendResult"
        );


    const subject =
        subjectInput.value.trim();


    const message =
        messageInput.value.trim();


    if (!subject || !message) {

        resultBox.innerHTML = `
            <div class="alert alert-danger">
                Subject and message are required.
            </div>
        `;

        return;

    }


    if (
        !newsletterSubscribers ||
        newsletterSubscribers.length === 0
    ) {

        resultBox.innerHTML = `
            <div class="alert alert-warning">
                There are no newsletter subscribers.
            </div>
        `;

        return;

    }


    const confirmed =
        confirm(
            `Send this newsletter to ${newsletterSubscribers.length} subscriber(s)?`
        );


    if (!confirmed) {
        return;
    }


    const originalText =
        sendButton.innerHTML;


    sendButton.disabled = true;


    sendButton.innerHTML =
        `<span class="spinner-border spinner-border-sm"></span>
         Sending...`;


    resultBox.innerHTML = `
        <div class="alert alert-info">
            Sending newsletter...
        </div>
    `;


    try {

        const result =
            await Api.post(
                "/newsletter/send",
                {
                    subject,
                    message
                }
            );


        if (result.success) {

            resultBox.innerHTML = `
                <div class="alert alert-success">

                    <strong>
                        Newsletter sending completed.
                    </strong>

                    <br>

                    Total:
                    ${result.total ?? newsletterSubscribers.length}

                    <br>

                    Sent:
                    ${result.sent ?? 0}

                    <br>

                    Failed:
                    ${result.failed ?? 0}

                </div>
            `;


            /*
             * Clear the form after a successful send.
             */

            subjectInput.value = "";
            messageInput.value = "";

        } else {

            resultBox.innerHTML = `
                <div class="alert alert-danger">

                    ${result.message ||
                      "Failed to send newsletter."}

                </div>
            `;

        }

    }

    catch (error) {

        console.error(
            "Newsletter Send Error:",
            error
        );


        resultBox.innerHTML = `
            <div class="alert alert-danger">

                Unable to send newsletter.
                Please check the server connection.

            </div>
        `;

    }


    sendButton.disabled = false;


    sendButton.innerHTML =
        originalText;

}