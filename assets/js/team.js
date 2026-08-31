// ========================================
// EJAR SOLUTIONS - PUBLIC TEAM
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    loadTeam();
});


// ========================================
// LOAD TEAM MEMBERS
// ========================================

async function loadTeam() {

    const container = document.getElementById("teamContainer");

    if (!container) {
        console.error("Team container not found.");
        return;
    }

    try {

        const response = await fetch(
            `${API.BASE_URL}/team/public`
        );

        const team = await response.json();

        if (!response.ok || !Array.isArray(team)) {

            console.error("Team API Error:", team);

            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Unable to load team members.
                    </div>
                </div>
            `;

            return;
        }

        if (team.length === 0) {

            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>No team members available.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        team.forEach(member => {

            let skills = [];

            try {

                if (Array.isArray(member.skills)) {
                    skills = member.skills;
                }
                else if (typeof member.skills === "string") {
                    skills = JSON.parse(member.skills);
                }

            } catch (error) {

                console.warn(
                    "Unable to parse team skills:",
                    member.name
                );

            }

            const skillsHTML = skills
                .map(skill => `<li>${escapeHTML(skill)}</li>`)
                .join("");

            const image = member.image
                ? member.image
                : "assets/images/about-left-image.jpg";

            const phoneHTML = member.phone
                ? `
                    <a href="tel:${escapeHTML(member.phone)}">
                        <i class="fas fa-phone-alt"></i>
                        ${escapeHTML(member.phone)}
                    </a>
                `
                : "";

            const emailHTML = member.email
                ? `
                    <a href="mailto:${escapeHTML(member.email)}">
                        <i class="fas fa-envelope"></i>
                        ${escapeHTML(member.email)}
                    </a>
                `
                : "";

            container.innerHTML += `

                <div class="col-lg-4 col-md-6">

                    <article class="team-card">

                        <img
                            class="team-photo"
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(member.role)}"
                        >

                        <span class="team-role">
                            ${escapeHTML(member.department || "")}
                        </span>

                        <h3>
                            ${escapeHTML(member.name)}
                        </h3>

                        <p>
                            ${escapeHTML(member.description)}
                        </p>

                        ${
                            skills.length > 0
                            ? `
                                <ul>
                                    ${skillsHTML}
                                </ul>
                            `
                            : ""
                        }

                        <div class="team-contact">

                            ${phoneHTML}

                            ${emailHTML}

                        </div>

                    </article>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Team Loading Error:",
            error
        );

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Unable to connect to the team service.
                </div>
            </div>
        `;

    }

}


// ========================================
// BASIC HTML ESCAPE
// ========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}