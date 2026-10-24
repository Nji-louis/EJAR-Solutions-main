// ========================================
// EJAR GROUP SARL - HOMEPAGE FAQ PREVIEW
// ========================================

const FALLBACK_HOME_FAQS = [
    {
        id: 1,
        question: "What services does EJAR GROUP SARL provide?",
        answer: "We support businesses with compliance, financial management, growth strategy, training, and operational support, while also offering professional cleaning and logistics services through our divisions.",
        status: "active",
        sort_order: 1
    },
    {
        id: 2,
        question: "Who do you work with?",
        answer: "We work with entrepreneurs, SMEs, households, property owners, and organizations across Douala, Buea, Yaoundé, and other business environments in Cameroon.",
        status: "active",
        sort_order: 2
    },
    {
        id: 3,
        question: "Can EJAR help with business compliance and tax filing?",
        answer: "Yes. We help with company registration, tax filing, regulatory and labour law compliance, corporate governance reviews, and internal controls to keep businesses protected and compliant.",
        status: "active",
        sort_order: 3
    },
    {
        id: 4,
        question: "Do you offer training and mentoring?",
        answer: "Yes. We deliver corporate and staff training, practical audit training, financial literacy and bookkeeping training, mentorship, workshops, seminars, and webinars.",
        status: "active",
        sort_order: 4
    }
];

document.addEventListener("DOMContentLoaded", () => {

    loadHomepageFAQs();

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

    console.warn("Using fallback FAQ content.", lastError);
    return FALLBACK_HOME_FAQS;

}

// ========================================
// LOAD HOMEPAGE FAQS
// ========================================

async function loadHomepageFAQs() {

    try {

        const faqs = await fetchPublicFaqs();

        const accordion =
            document.getElementById("faqAccordion");

        if (!accordion) {

            console.error(
                "Homepage FAQ accordion not found."
            );

            return;

        }

        const activeFaqs =
            faqs.filter(
                faq => faq && faq.status === "active"
            );

        const previewFaqs =
            activeFaqs.slice(0, 4);

        accordion.innerHTML = "";

        previewFaqs.forEach((faq, index) => {

            const faqId =
                `homepageFaq${index + 1}`;

            const isFirst =
                index === 0;

            accordion.innerHTML += `

                <div class="accordion-item">

                    <h3 class="accordion-header">

                        <button
                            class="accordion-button ${isFirst ? "" : "collapsed"}"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#${faqId}"
                            aria-expanded="${isFirst ? "true" : "false"}"
                            aria-controls="${faqId}">

                            ${faq.question}

                        </button>

                    </h3>

                    <div
                        id="${faqId}"
                        class="accordion-collapse collapse ${isFirst ? "show" : ""}"
                        data-bs-parent="#faqAccordion">

                        <div class="accordion-body">

                            ${faq.answer}

                        </div>

                    </div>

                </div>

            `;

        });

        if (previewFaqs.length === 0) {
            accordion.innerHTML = `
                <div class="alert alert-info mb-0">FAQs are temporarily unavailable. Please check back soon.</div>
            `;
        }

    }

    catch (error) {

        console.error(
            "Unable to load homepage FAQs:",
            error
        );

        const accordion =
            document.getElementById("faqAccordion");

        if (accordion) {
            accordion.innerHTML = `
                <div class="alert alert-info mb-0">FAQs are temporarily unavailable. Please check back soon.</div>
            `;
        }

    }

}