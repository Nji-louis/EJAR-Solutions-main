document.addEventListener("DOMContentLoaded", () => {

    const contactForm = document.getElementById("contact-form");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const submitBtn = document.getElementById("form-submit");

        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        const data = {

            name: document.getElementById("contact-name").value.trim(),

            phone: document.getElementById("contact-phone").value.trim(),

            email: document.getElementById("contact-email").value.trim(),

            subject: document.getElementById("contact-service").value,

            message: document.getElementById("contact-message").value.trim()

        };

        // Simple validation
        if (
            !data.name ||
            !data.phone ||
            !data.email ||
            !data.subject ||
            !data.message
        ) {

            alert("Please complete all required fields.");

            submitBtn.disabled = false;
            submitBtn.innerText = "Send Inquiry";

            return;
        }

        try {

            const result = await Api.publicPost("/messages", data);

            if (result.success) {

                alert("✅ Your inquiry has been sent successfully.");

                contactForm.reset();

            } else {

                alert(result.message || "Failed to send your inquiry.");

            }

        } catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");

        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Send Inquiry";

    });

});
