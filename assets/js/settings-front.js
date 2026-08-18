// ========================================
// EJAR SOLUTIONS - PUBLIC SETTINGS
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadPublicSettings();

});


// ========================================
// LOAD PUBLIC SETTINGS
// ========================================

async function loadPublicSettings() {

    try {

        const response =
            await fetch(`${API.BASE_URL}/settings/public`);

        if (!response.ok) {

            throw new Error(
                `Settings request failed: ${response.status}`
            );

        }

        const data = await response.json();

        if (!data.success || !data.settings) {

            throw new Error(
                "Invalid settings response."
            );

        }

        applyPublicSettings(data.settings);

    }

    catch (error) {

        console.error(
            "Public Settings Error:",
            error
        );

    }

}


// ========================================
// APPLY SETTINGS TO FRONTEND
// ========================================

function applyPublicSettings(settings) {

    // ------------------------------------
    // COMPANY NAME
    // ------------------------------------

    document
        .querySelectorAll("[data-setting='company_name']")
        .forEach(element => {

            element.textContent =
                settings.company_name || "";

        });


    // ------------------------------------
    // ADDRESS
    // ------------------------------------

    document
        .querySelectorAll("[data-setting='address']")
        .forEach(element => {

            element.textContent =
                settings.address || "";

        });


    // ------------------------------------
    // PHONE
    // ------------------------------------

    document
        .querySelectorAll("[data-setting='phone']")
        .forEach(element => {

            element.textContent =
                settings.phone || "";

            if (element.tagName === "A") {

                element.href =
                    `tel:${settings.phone}`;

            }

        });


    // ------------------------------------
    // EMAIL
    // ------------------------------------

    document
        .querySelectorAll("[data-setting='email']")
        .forEach(element => {

            element.textContent =
                settings.email || "";

            if (element.tagName === "A") {

                element.href =
                    `mailto:${settings.email}`;

            }

        });


    // ------------------------------------
    // WEBSITE
    // ------------------------------------

    document
        .querySelectorAll("[data-setting='website']")
        .forEach(element => {

            element.textContent =
                settings.website || "";

            if (element.tagName === "A") {

                element.href =
                    settings.website || "#";

            }

        });


    // ------------------------------------
    // SOCIAL LINKS
    // ------------------------------------

    applySocialLink(
        "facebook",
        settings.facebook
    );

    applySocialLink(
        "linkedin",
        settings.linkedin
    );

    applySocialLink(
        "instagram",
        settings.instagram
    );

    applySocialLink(
        "youtube",
        settings.youtube
    );


    // ------------------------------------
    // LOGO
    // ------------------------------------

    document
        .querySelectorAll("[data-setting-logo]")
        .forEach(element => {

            if (settings.logo) {

                element.src =
                    API.assetUrl(settings.logo);

            }

            if (settings.company_name) {

                element.alt =
                    settings.company_name;

            }

        });

}


// ========================================
// SOCIAL LINK HELPER
// ========================================

function applySocialLink(type, url) {

    if (!url) return;

    document
        .querySelectorAll(
            `[data-setting-social="${type}"]`
        )
        .forEach(element => {

            element.href = url;

        });

}