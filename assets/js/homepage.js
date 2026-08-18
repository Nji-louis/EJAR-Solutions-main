// ========================================
// EJAR SOLUTIONS HOMEPAGE CMS
// ========================================

let editingHero = null;

document.addEventListener("DOMContentLoaded", () => {

    loadHeroSlides();

    document
        .getElementById("addHero")
        .addEventListener("click", openCreateModal);

        document
.getElementById("heroImage")
.addEventListener("change", uploadHeroImage);

        

    document
        .getElementById("saveHero")
        .addEventListener("click", saveHero);

});



// ========================================
// LOAD HERO SLIDES
// ========================================

async function loadHeroSlides() {

    try {

        const slides = await Api.get("/homepage/hero");

        const table = document.getElementById("heroTable");

        table.innerHTML = "";

        slides.forEach(slide => {

            table.innerHTML += `

            <tr>

                <td>${slide.id}</td>

                <td>${slide.title}</td>

                <td>${slide.status}</td>

                <td>${slide.sort_order}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${slide.id}">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm delete-btn"
                        data-id="${slide.id}">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        document.querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    editHero(btn.dataset.id);

                });

            });

        document.querySelectorAll(".delete-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    deleteHero(btn.dataset.id);

                });

            });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load hero slides.");

    }

}



async function uploadHeroImage() {

    const file =
        document.getElementById("heroImage").files[0];

    if (!file) return;

    try {

        const response =
            await Api.upload(file);

        document.getElementById("background_image").value =
            response.imageUrl;

        const preview =
            document.getElementById("heroPreview");

        preview.src = API.assetUrl(response.imageUrl);

        preview.style.display = "block";

    }

    catch (err) {

        console.error(err);

        alert("Image upload failed.");

    }

}


// ========================================
// OPEN EMPTY MODAL
// ========================================

function openCreateModal() {

    editingHero = null;

    document.getElementById("heroForm").reset();

    document.getElementById("background_image").value="";

const preview =
document.getElementById("heroPreview");

preview.src="";

preview.style.display="none";

    new bootstrap.Modal(
        document.getElementById("heroModal")
    ).show();

}



// ========================================
// EDIT HERO
// ========================================

async function editHero(id) {

    try {

        const slides = await Api.get("/homepage/hero");

        const hero = slides.find(s => s.id == id);

        editingHero = id;

        document.getElementById("title").value = hero.title;

        document.getElementById("subtitle").value = hero.subtitle;

        document.getElementById("description").value = hero.description;

        document.getElementById("button1_text").value = hero.button1_text;

        document.getElementById("button1_url").value = hero.button1_url;

        document.getElementById("button2_text").value = hero.button2_text;

        document.getElementById("button2_url").value = hero.button2_url;

        document.getElementById("background_image").value =
hero.image;


const preview = document.getElementById("heroPreview");

if (hero.image) {

    preview.src = API.assetUrl(hero.image);

    preview.style.display = "block";

} else {

    preview.style.display = "none";

}

preview.style.display = "block";

        document.getElementById("sort_order").value = hero.sort_order;

        document.getElementById("status").value = hero.status;

        new bootstrap.Modal(
            document.getElementById("heroModal")
        ).show();

    }

    catch (err) {

        console.error(err);

    }

}





async function saveHero() {

    try {

        let image =
            document.getElementById("background_image").value;

        // Keep old image when editing
        if (editingHero !== null) {

            const slides = await Api.get("/homepage/hero");
            const hero = slides.find(s => s.id == editingHero);

            if (hero) {
                image = hero.image;
            }

        }

        const data = {

            title:
                document.getElementById("title").value,

            subtitle:
                document.getElementById("subtitle").value,

            description:
                document.getElementById("description").value,

            button1_text:
                document.getElementById("button1_text").value,

            button1_url:
                document.getElementById("button1_url").value,

            button2_text:
                document.getElementById("button2_text").value,

            button2_url:
                document.getElementById("button2_url").value,

            image,

            sort_order:
                document.getElementById("sort_order").value,

            status:
                document.getElementById("status").value

        };

        let result;

        if (editingHero === null) {

            result = await Api.post("/homepage/hero", data);

        } else {

            result = await Api.put(
                `/homepage/hero/${editingHero}`,
                data
            );

        }

        alert(result.message);

        bootstrap.Modal
            .getInstance(
                document.getElementById("heroModal")
            )
            .hide();

        loadHeroSlides();

    }
    catch (err) {

        console.error(err);

        alert("Unable to save hero.");

    }

}


// ========================================
// DELETE HERO
// ========================================

async function deleteHero(id) {

    if (!confirm("Delete this hero slide?")) {

        return;

    }

    try {

        const result = await Api.delete(`/homepage/hero/${id}`);

        alert(result.message);

        loadHeroSlides();

    }

    catch (err) {

        console.error(err);

        alert("Unable to delete hero.");

    }

}
