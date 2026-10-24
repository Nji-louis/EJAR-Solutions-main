// ========================================
// EJAR GROUP SARL - FAQ FRONTEND
// ========================================

const FALLBACK_FAQS = [
    {
        id: 1,
        question: "What services does EJAR GROUP SARL provide?",
        answer: "We support businesses with compliance, financial management, growth strategy, training, and operational support, while also delivering professional cleaning and logistics support through our divisions.",
        status: "active",
        sort_order: 1
    },
    {
        id: 2,
        question: "Who do you work with?",
        answer: "We serve entrepreneurs, SMEs, property owners, households, and organizations across Cameroon, with a strong focus on Douala, Buea, and Yaoundé.",
        status: "active",
        sort_order: 2
    },
    {
        id: 3,
        question: "Can EJAR help with tax compliance and company registration?",
        answer: "Yes. We help companies with registration, tax compliance, labour and regulatory compliance, governance reviews, and internal control assessments.",
        status: "active",
        sort_order: 3
    },
    {
        id: 4,
        question: "Do you offer practical training and mentorship?",
        answer: "Yes. We provide corporate training, bookkeeping and financial literacy training, practical audit training, mentorship, seminars, and webinars.",
        status: "active",
        sort_order: 4
    }
];

document.addEventListener("DOMContentLoaded", () => {

    loadFAQs();

});

async function fetchPublicFaqs() {

    const endpoints = [
        "/faqs/public",
        "/faqs"
    ];

    let lastError = null;

    for (const endpoint of endpoints) {

        try {

            const response = await Api.publicGet(endpoint);
            const payload = Array.isArray(response)
                ? response
                : Array.isArray(response.faqs)
                    ? response.faqs
                    : Array.isArray(response.data)
                        ? response.data
                        : [];

            if (payload.length > 0) {
                return payload;
            }

        }
        catch (error) {
            lastError = error;
        }

    }

    console.warn("Using fallback FAQ data.", lastError);
    return FALLBACK_FAQS;

}

async function loadFAQs() {

    try {

        const faqs = await fetchPublicFaqs();

        const container =
            document.getElementById("faqContainer");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        faqs
            .filter(faq => faq && faq.status === "active")
            .forEach(faq => {

                container.innerHTML += `

                <div class="faq-item">

                    <div class="faq-question">

                        <span>${faq.question}</span>

                        <span class="faq-icon">+</span>

                    </div>

                    <div class="faq-answer">

                        ${faq.answer}

                    </div>

                </div>

                `;

            });

        if (!container.querySelector(".faq-item")) {
            container.innerHTML = `
                <div class="alert alert-info">FAQs are temporarily unavailable. Please check back soon.</div>
            `;
            return;
        }

        document
            .querySelectorAll(".faq-question")
            .forEach(question => {

                question.addEventListener("click", function () {

                    const item =
                        this.parentElement;

                    const answer =
                        item.querySelector(".faq-answer");

                    const icon =
                        item.querySelector(".faq-icon");

                    document
                        .querySelectorAll(".faq-answer")
                        .forEach(a => {

                            if (a !== answer) {

                                a.style.display = "none";

                            }

                        });

                    document
                        .querySelectorAll(".faq-icon")
                        .forEach(i => {

                            if (i !== icon) {

                                i.innerHTML = "+";

                            }

                        });

                    if (answer.style.display === "block") {

                        answer.style.display = "none";

                        icon.innerHTML = "+";

                    }

                    else {

                        answer.style.display = "block";

                        icon.innerHTML = "−";

                    }

                });

            });

    }

    catch (err) {

        console.error(err);

        const container = document.getElementById("faqContainer");
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info">FAQs are temporarily unavailable. Please check back soon.</div>
            `;
        }

    }

}
