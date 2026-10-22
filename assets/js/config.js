const API = {
    BASE_URL:
        window.EJAR_API_BASE_URL ||
        "https://api.ejargroup.com/api",

    get ASSET_BASE_URL() {
        return this.BASE_URL.replace(/\/api\/?$/, "");
    },

    assetUrl(path) {
        if (!path) return "";
        const normalizedPath = String(path).replace(/\\/g, "/");

        if (/^(?:https?:)?\/\//i.test(normalizedPath) || /^(?:data|blob):/i.test(normalizedPath)) {
            return normalizedPath;
        }

        if (/^\/?uploads\//i.test(normalizedPath)) {
            return `${this.ASSET_BASE_URL}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
        }

        return normalizedPath;
    }
};
