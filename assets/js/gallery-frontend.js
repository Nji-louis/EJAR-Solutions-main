document.addEventListener("DOMContentLoaded", loadGallery);

async function loadGallery() {

    try {

        const gallery = await Api.publicGet("/gallery");

        const container =
            document.getElementById("galleryContainer");

        container.innerHTML = "";

        gallery.forEach(item => {

            container.innerHTML += `

            <div class="col-lg-4 col-md-6"
                 data-category="${item.category}">

                <figure class="gallery-card">

                    <button
                        data-lightbox="${API.assetUrl(item.image)}">

                        <img
                            src="${API.assetUrl(item.image)}"
                            alt="${item.title}">

                    </button>

                    <figcaption>

                        ${item.title}

                    </figcaption>

                </figure>

            </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}
