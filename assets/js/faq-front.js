// ========================================
// EJAR SOLUTIONS - FAQ FRONTEND
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadFAQs();

});

async function loadFAQs() {

    try {

        const faqs =
            await Api.publicGet("/faqs");

        const container =
            document.getElementById("faqContainer");

        container.innerHTML = "";

        faqs
            .filter(faq => faq.status === "active")
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

        // Accordion Behaviour

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

    }

}
