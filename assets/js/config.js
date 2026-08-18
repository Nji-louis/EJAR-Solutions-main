const API = {
    BASE_URL:
        window.EJAR_API_BASE_URL ||
        "http://localhost:5000/api",

    get ASSET_BASE_URL() {
        return this.BASE_URL.replace(/\/api\/?$/, "");
    },

    assetUrl(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        return `${this.ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    }
};
