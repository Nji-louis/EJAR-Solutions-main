const Api = {

    getToken() {
        return localStorage.getItem("token");
    },

    redirectToLogin() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.endsWith("/admin/login.html")) {
            window.location.href = "login.html";
        }
    },

    async parseResponse(response, protectedRequest = false) {
        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            data = {
                success: false,
                message: "Unexpected server response."
            };
        }

        if (
            protectedRequest &&
            [400, 401, 403].includes(response.status)
        ) {
            this.redirectToLogin();
        }

        return data;
    },

    async post(endpoint, data) {

        const response = await fetch(`${API.BASE_URL}${endpoint}`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.getToken()}`
            },

            body: JSON.stringify(data)

        });

        return await this.parseResponse(response, true);

    },

    async publicGet(endpoint) {

        const response = await fetch(`${API.BASE_URL}${endpoint}`);

        return await this.parseResponse(response);

    },

    async publicPost(endpoint, data) {

        const response = await fetch(`${API.BASE_URL}${endpoint}`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        return await this.parseResponse(response);

    },

    async get(endpoint) {

        const response = await fetch(`${API.BASE_URL}${endpoint}`, {

            headers: {
                "Authorization": `Bearer ${this.getToken()}`
            }

        });

        return await this.parseResponse(response, true);

    },


    async delete(endpoint) {

    const response = await fetch(`${API.BASE_URL}${endpoint}`, {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${this.getToken()}`
        }

    });

    return await this.parseResponse(response, true);

},

async put(endpoint, data) {

    const response = await fetch(`${API.BASE_URL}${endpoint}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.getToken()}`
        },

        body: JSON.stringify(data)

    });

    return await this.parseResponse(response, true);

},


async upload(file) {

    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
        `${API.BASE_URL}/uploads`,
        {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${this.getToken()}`
            },

            body: formData
        }
    );

    return await this.parseResponse(response, true);

}


};
