// ========================================
// EJAR SOLUTIONS - FAQ MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadFAQs();

    document
        .getElementById("faqForm")
        .addEventListener("submit", saveFAQ);

});

let editingId = null;

// ========================================
// LOAD FAQS
// ========================================

async function loadFAQs() {

    try {

        const faqs = await Api.get("/faqs");

        const table =
            document.getElementById("faqTable");

        table.innerHTML = "";

        faqs.forEach(faq => {

            table.innerHTML += `

            <tr>

                <td>${faq.id}</td>

                <td>${faq.question}</td>

                <td>${faq.sort_order}</td>

                <td>

                    <span class="badge ${faq.status === "active"
                        ? "bg-success"
                        : "bg-secondary"}">

                        ${faq.status}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editFAQ(${faq.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteFAQ(${faq.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load FAQs.");

    }

}

// ========================================
// SAVE FAQ
// ========================================

async function saveFAQ(e) {

    e.preventDefault();

    const data = {

        question:
            document.getElementById("question").value,

        answer:
            document.getElementById("answer").value,

        sort_order:
            document.getElementById("sort_order").value,

        status:
            document.getElementById("status").value

    };

    try {

        let result;

        if (editingId) {

            result = await Api.put(
                `/faqs/${editingId}`,
                data
            );

        }

        else {

            result = await Api.post(
                "/faqs",
                data
            );

        }

        alert(result.message);

        document
            .getElementById("faqForm")
            .reset();

        editingId = null;

        document.getElementById("form-submit").innerText =
            "Save FAQ";

        bootstrap.Modal
            .getInstance(
                document.getElementById("faqModal")
            )
            .hide();

        loadFAQs();

    }

    catch (err) {

        console.error(err);

        alert("Unable to save FAQ.");

    }

}

// ========================================
// EDIT FAQ
// ========================================

async function editFAQ(id) {

    try {

        const faq =
            await Api.get(`/faqs/${id}`);

        editingId = id;

        document.getElementById("question").value =
            faq.question;

        document.getElementById("answer").value =
            faq.answer;

        document.getElementById("sort_order").value =
            faq.sort_order;

        document.getElementById("status").value =
            faq.status;

        document.getElementById("form-submit").innerText =
            "Update FAQ";

        new bootstrap.Modal(
            document.getElementById("faqModal")
        ).show();

    }

    catch (err) {

        console.error(err);

        alert("Unable to load FAQ.");

    }

}

// ========================================
// DELETE FAQ
// ========================================

async function deleteFAQ(id) {

    if (!confirm("Delete this FAQ?")) return;

    try {

        const result =
            await Api.delete(`/faqs/${id}`);

        alert(result.message);

        loadFAQs();

    }

    catch (err) {

        console.error(err);

        alert("Unable to delete FAQ.");

    }

}