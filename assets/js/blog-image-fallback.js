(function () {
    "use strict";

    const scriptUrl = document.currentScript && document.currentScript.src;
    if (!scriptUrl) {
        console.error("Blog image fallback script URL is unavailable.");
        return;
    }

    const fallbackImage = new URL("../images/service-image01.jpg", scriptUrl).href;

    document.addEventListener("error", event => {
        const image = event.target;

        if (
            !(image instanceof HTMLImageElement) ||
            !image.hasAttribute("data-blog-image") ||
            image.dataset.fallbackApplied === "true"
        ) {
            return;
        }

        image.dataset.fallbackApplied = "true";
        image.src = fallbackImage;
    }, true);
})();
