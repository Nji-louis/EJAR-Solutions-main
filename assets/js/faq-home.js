// ========================================
// EJAR SOLUTIONS - HOMEPAGE FAQ PREVIEW
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadHomepageFAQs();

});


// ========================================
// LOAD HOMEPAGE FAQS
// ========================================

async function loadHomepageFAQs() {

    try {

        const faqs =
            await Api.publicGet("/faqs/public");

        const accordion =
            document.getElementById("faqAccordion");

        if (!accordion) {

            console.error(
                "Homepage FAQ accordion not found."
            );

            return;

        }

        if (!Array.isArray(faqs)) {

            console.error(
                "FAQ API did not return an array:",
                faqs
            );

            return;

        }

        // Only active FAQs
        const activeFaqs =
            faqs.filter(
                faq => faq.status === "active"
            );

        // Homepage preview should show only a few FAQs
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

    }

    catch (error) {

        console.error(
            "Unable to load homepage FAQs:",
            error
        );

    }

}