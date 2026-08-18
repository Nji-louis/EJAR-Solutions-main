// ========================================
// EJAR SOLUTIONS - FRONTEND TESTIMONIALS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    loadTestimonials();
});

async function loadTestimonials() {

    try {

        const testimonials = await Api.publicGet("/testimonials/public");

        const container =
            document.getElementById("testimonialsContainer");

        container.innerHTML = "";

        testimonials
            .filter(item => item.status === "active")
            .forEach(item => {

                const image = item.image
                    ? API.assetUrl(item.image)
                    : "assets/images/testimonials-01.jpg";

                container.innerHTML += `

                <div class="col-lg-4 col-md-6">

                    <article class="testimonial-card">

                        <img
                            src="${image}"
                            alt="${item.name}"
                            class="rounded-circle mb-3"
                            style="width:90px;height:90px;object-fit:cover;">

                        <h4>${item.name}</h4>

                        <small>

                            ${item.position || ""}

                            ${item.company ? " - " + item.company : ""}

                        </small>

                        <p class="mt-3">

                            "${item.testimonial}"

                        </p>

                        <div class="text-warning mb-2">

                            ${"★".repeat(item.rating)}

                        </div>

                    </article>

                </div>

                `;

            });

    }

    catch (error) {

        console.error(error);

    }

}
