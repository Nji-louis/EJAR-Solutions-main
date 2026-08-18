// ========================================
// EJAR SOLUTIONS - HOMEPAGE GALLERY
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadHomepageGallery();

});


// ========================================
// LOAD GALLERY FROM BACKEND
// ========================================

async function loadHomepageGallery() {

    try {

        const gallery =
            await Api.publicGet("/gallery");

        const container =
            document.getElementById(
                "homepageGalleryContainer"
            );

        if (!container) {

            console.error(
                "Homepage gallery container not found."
            );

            return;

        }


        if (!Array.isArray(gallery)) {

            console.error(
                "Gallery API did not return an array:",
                gallery
            );

            return;

        }


        container.innerHTML = "";


        // Show only the first 3 gallery images
        // on the homepage.

        const featuredGallery =
            gallery.slice(0, 3);


        featuredGallery.forEach(image => {

            const imageUrl =
                image.image
                    ? API.assetUrl(image.image)
                    : "assets/images/service-details-01.jpg";


            container.innerHTML += `

                <div class="col-lg-4">

                    <div class="gallery-card">

                        <img
                            src="${imageUrl}"
                            alt="${image.title || "EJAR SOLUTIONS gallery image"}"
                            class="img-fluid">

                        <h4>
                            ${image.title || ""}
                        </h4>

                    </div>

                </div>

            `;

        });


    }

    catch (error) {

        console.error(
            "Unable to load homepage gallery:",
            error
        );

    }

}