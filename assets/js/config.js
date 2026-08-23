const API = {
    BASE_URL:
        window.EJAR_API_BASE_URL ||
        "https://backend-ejar-solutions.onrender.com/api",

    get ASSET_BASE_URL() {
        return this.BASE_URL.replace(/\/api\/?$/, "");
    },

    assetUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `${this.ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    }
};
