// ========================================
// EJAR SOLUTIONS - FRONTEND SERVICES
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadServices();

});

async function loadServices() {

    try {

        const services = await Api.publicGet("/services");

        const container =
            document.getElementById("servicesContainer");

        if (!container) return;

        container.innerHTML = "";

        const activeServices = services
            .filter(service => service.status === "active");

        if (!activeServices.length) {
            container.innerHTML = `
                <div class="col-lg-12">
                    <p class="text-center">Service information is being updated. Please contact EJAR SOLUTIONS for current support options.</p>
                </div>
            `;
            return;
        }

        activeServices.forEach((service, index) => {

                const image = API.assetUrl(service.image);

                const layout = index % 2 === 0;

                container.innerHTML += layout ?

                `
                <div class="col-lg-12">

                    <article class="service-item">

                        <div class="row">

                            <div class="col-lg-6">

                                <div class="left-image">

                                    <img
                                        src="${image}"
                                        alt="${service.title}">

                                </div>

                            </div>

                            <div class="col-lg-6 align-self-center">

                                <div class="right-text-content">

                                    <i class="${service.icon}"></i>

                                    <h2>${service.title}</h2>

                                    <p>${service.short_description}</p>

                                    <div class="green-button mt-3">

                                        <a href="services/${service.slug}.html">

                                            Read More

                                        </a>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </article>

                </div>
                `

                :

                `
                <div class="col-lg-12">

                    <article class="service-item">

                        <div class="row">

                            <div class="col-lg-6 align-self-center">

                                <div class="left-text-content">

                                    <i class="${service.icon}"></i>

                                    <h2>${service.title}</h2>

                                    <p>${service.short_description}</p>

                                    <div class="green-button mt-3">

                                        <a href="services/${service.slug}.html">

                                            Read More

                                        </a>

                                    </div>

                                </div>

                            </div>

                            <div class="col-lg-6">

                                <div class="right-image">

                                    <img
                                        src="${image}"
                                        alt="${service.title}">

                                </div>

                            </div>

                        </div>

                    </article>

                </div>
                `;

            });

    }

    catch (error) {

        console.error(error);

        const container =
            document.getElementById("servicesContainer");

        if (container) {
            container.innerHTML = `
                <div class="col-lg-12">
                    <p class="text-center">Unable to load services right now. Please try again later or contact EJAR SOLUTIONS directly.</p>
                </div>
            `;
        }

    }

}
