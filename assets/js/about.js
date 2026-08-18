// ========================================
// EJAR ABOUT CMS
// ========================================

let aboutImage = "";

document.addEventListener("DOMContentLoaded", () => {

    loadAbout();

    document
        .getElementById("aboutImage")
        .addEventListener("change", uploadAboutImage);

    document
        .getElementById("saveAbout")
        .addEventListener("click", saveAbout);

});


// ========================================
// LOAD ABOUT
// ========================================

async function loadAbout() {

    try {

        const about = await Api.get("/homepage/about");

        document.getElementById("heading").value =
            about.heading || "";

        document.getElementById("subtitle").value =
            about.subtitle || "";

        document.getElementById("description").value =
            about.description || "";

        document.getElementById("experience_years").value =
            about.experience_years || "";

        document.getElementById("button_text").value =
            about.button_text || "";

        document.getElementById("button_url").value =
            about.button_url || "";

        aboutImage = about.image || "";

        if (aboutImage !== "") {

            const preview =
                document.getElementById("aboutPreview");

            preview.src =
                API.BASE_URL.replace("/api", "") + aboutImage;

            preview.style.display = "block";

        }

    }

    catch (err) {

        console.error(err);

        alert("Unable to load About section.");

    }

}


// ========================================
// IMAGE UPLOAD
// ========================================

async function uploadAboutImage() {

    const file =
        document.getElementById("aboutImage").files[0];

    if (!file) return;

    try {

        const result = await Api.upload(file);

        aboutImage = result.imageUrl;

        const preview =
            document.getElementById("aboutPreview");

        preview.src =
            API.BASE_URL.replace("/api", "") + aboutImage;

        preview.style.display = "block";

    }

    catch (err) {

        console.error(err);

        alert("Image upload failed.");

    }

}


// ========================================
// SAVE ABOUT
// ========================================

async function saveAbout() {

    const data = {

        heading:
            document.getElementById("heading").value,

        subtitle:
            document.getElementById("subtitle").value,

        description:
            document.getElementById("description").value,

        image:
            aboutImage,

        experience_years:
            document.getElementById("experience_years").value,

        button_text:
            document.getElementById("button_text").value,

        button_url:
            document.getElementById("button_url").value

    };

    try {

        const result =
    await Api.put("/homepage/about", data);

alert(result.message);

loadAbout();

    }

    catch (err) {

        console.error(err);

        alert("Unable to save About section.");

    }

}