// ========================================
// EJAR SOLUTIONS - HOMEPAGE TESTIMONIALS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    loadHomepageTestimonials();
});

async function loadHomepageTestimonials() {

    try {

        const testimonials =
            await Api.publicGet("/testimonials/public");

        const container =
            document.getElementById("homepageTestimonials");

        if (!container) {
            console.error("Homepage testimonials container not found.");
            return;
        }

        if (!Array.isArray(testimonials)) {
            console.error(
                "Testimonials API did not return an array:",
                testimonials
            );
            return;
        }

        // Only active testimonials
        const activeTestimonials =
            testimonials.filter(
                item => item.status === "active"
            );

        // Clear existing content
        container.innerHTML = "";

        // Create testimonial cards
        activeTestimonials.forEach(item => {

            const image = item.image
                ? API.assetUrl(item.image)
                : "assets/images/testimonials-01.jpg";

            const rating =
                Math.max(
                    0,
                    Math.min(
                        5,
                        Number(item.rating) || 0
                    )
                );

            // Keep the existing visual style.
            // Use the check icon as the default existing design.
            container.innerHTML += `

                <article class="item">

                    <i class="fa fa-check"></i>

                    <p>
                        ${item.testimonial}
                    </p>

                    <h3>
                        ${item.name}
                    </h3>

                    <span>
                        ${item.position || ""}
                        ${item.company ? " - " + item.company : ""}
                    </span>

                    <div class="right-image">

                        <img
                            src="${image}"
                            alt="${item.name}"
                        >

                    </div>

                </article>

            `;

        });

        // ========================================
        // REINITIALIZE OWL CAROUSEL
        // ========================================

        if (
            typeof $ !== "undefined" &&
            typeof $.fn.owlCarousel === "function"
        ) {

            // Destroy previous carousel if already initialized
            if (
                container.classList.contains("owl-loaded")
            ) {

                $(container)
                    .trigger("destroy.owl.carousel");

                container.classList.remove(
                    "owl-loaded"
                );

            }

            // Initialize the existing EJAR slider
            $(container).owlCarousel({

                loop: activeTestimonials.length > 1,

                margin: 30,

                nav: false,

                dots: true,

                autoplay: true,

                autoplayTimeout: 5000,

                autoplayHoverPause: true,

                responsive: {

                    0: {
                        items: 1
                    },

                    768: {
                        items: 1
                    },

                    1000: {
                        items: 1
                    }

                }

            });

        }

    }

    catch (error) {

        console.error(
            "Unable to load homepage testimonials:",
            error
        );

    }

}