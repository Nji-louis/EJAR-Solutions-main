// ======================================
// // EJAR SOLUTIONS - SETTINGS MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadSettings();

    document
        .getElementById("settingsForm")
        .addEventListener("submit", saveSettings);

});

// ========================================
// LOAD SETTINGS
// ========================================

async function loadSettings() {

    try {

        const settings = await Api.get("/settings");

        document.getElementById("company_name").value =
            settings.company_name || "";

        document.getElementById("address").value =
            settings.address || "";

        document.getElementById("phone").value =
            settings.phone || "";

        document.getElementById("email").value =
            settings.email || "";

        document.getElementById("website").value =
            settings.website || "";

        document.getElementById("facebook").value =
            settings.facebook || "";

        document.getElementById("linkedin").value =
            settings.linkedin || "";

        document.getElementById("instagram").value =
            settings.instagram || "";

        document.getElementById("youtube").value =
            settings.youtube || "";

        if (settings.logo) {

            document.getElementById("logoPreview").innerHTML = `
                <img
                    src="${API.assetUrl(settings.logo)}"
                    width="120"
                    class="img-thumbnail">
            `;

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to load settings.");

    }

}

// ========================================
// SAVE SETTINGS
// ========================================

async function saveSettings(e) {

    e.preventDefault();

    try {

        let logoPath = "";

        const logoFile =
            document.getElementById("logo").files[0];

        // Upload new logo if selected

        if (logoFile) {

            const uploadResult =
                await Api.upload(logoFile);

            if (!uploadResult.success) {

                alert(uploadResult.message);

                return;

            }

            logoPath = uploadResult.imageUrl;

        } else {

            const current =
                await Api.get("/settings");

            logoPath = current.logo;

        }

        const settings = {

            company_name:
                document.getElementById("company_name").value,

            address:
                document.getElementById("address").value,

            phone:
                document.getElementById("phone").value,

            email:
                document.getElementById("email").value,

            website:
                document.getElementById("website").value,

            facebook:
                document.getElementById("facebook").value,

            linkedin:
                document.getElementById("linkedin").value,

            instagram:
                document.getElementById("instagram").value,

            youtube:
                document.getElementById("youtube").value,

            logo: logoPath

        };

        const result =
            await Api.put("/settings", settings);

        alert(result.message);

        loadSettings();

    }

    catch (error) {

        console.error(error);

        alert("Unable to save settings.");

    }

}
