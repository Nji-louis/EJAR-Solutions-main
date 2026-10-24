// ========================================
// EJAR GROUP SARL - PUBLIC TEAM
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const isTeamPage = Boolean(document.getElementById("teamPageContainer"));
    loadTeam(isTeamPage);
});


// ========================================
// LOAD TEAM MEMBERS
// ========================================

async function loadTeam(isTeamPage = false) {
    const container = document.getElementById(
        isTeamPage ? "teamPageContainer" : "teamContainer"
    );

    if (!container) {
        console.error("Team container not found.");
        return;
    }

    try {
        const response = await fetch(`${API.BASE_URL}/team/public`);
        const team = await response.json();

        if (!response.ok || !Array.isArray(team)) {
            console.error("Team API Error:", team);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
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

        container.innerHTML = team
            .map((member, index) => isTeamPage
                ? renderTeamProfile(member, index)
                : renderTeamMember(member))
            .join("");

        if (isTeamPage) {
            scrollToSelectedTeamMember(team);
        }
    } catch (error) {
        console.error("Team Loading Error:", error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    Unable to connect to the team service.
                </div>
            </div>
        `;
    }
}

function renderTeamMember(member) {
    const name = escapeHTML(member.name);
    const photoHTML = member.image
        ? `<img class="team-photo" src="${escapeHTML(API.assetUrl(member.image))}" alt="${name || "Team member"}">`
        : "";
    const memberLink = member.id !== null && member.id !== undefined && member.id !== ""
        ? `team.html?id=${encodeURIComponent(String(member.id))}`
        : "team.html";

    return `
        <div class="col-lg-4 col-md-6">
            <article class="team-card">
                ${photoHTML}
                ${member.department ? `<span class="team-department">${escapeHTML(member.department)}</span>` : ""}
                <h3>${name}</h3>
                ${member.role ? `<p class="team-role">${escapeHTML(member.role)}</p>` : ""}
                ${member.description ? `<p class="team-intro">${escapeHTML(member.description)}</p>` : ""}
                <a class="team-more-button" href="${escapeHTML(memberLink)}">More Information<span class="visually-hidden"> about ${name}</span></a>
            </article>
        </div>
    `;
}

function renderTeamProfile(member, index) {
    const skills = parseTeamSkills(member.skills);
    const phoneHTML = member.phone
        ? `<a href="tel:${escapeHTML(member.phone)}">
                <i class="fas fa-phone-alt" aria-hidden="true"></i>
                ${escapeHTML(member.phone)}
            </a>`
        : "";
    const emailHTML = member.email
        ? `<a href="mailto:${escapeHTML(member.email)}">
                <i class="fas fa-envelope" aria-hidden="true"></i>
                ${escapeHTML(member.email)}
            </a>`
        : "";
    const contactHTML = phoneHTML || emailHTML
        ? `<section class="team-detail-group" aria-label="Contact information">
                <h4>Contact</h4>
                <div class="team-contact">${phoneHTML}${emailHTML}</div>
            </section>`
        : "";
    const skillsHTML = skills.length
        ? `<section class="team-detail-group" aria-label="Skills">
                <h4>Skills</h4>
                <ul>${skills.map(skill => `<li>${escapeHTML(skill)}</li>`).join("")}</ul>
            </section>`
        : "";
    const name = escapeHTML(member.name);
    const isSelected = new URLSearchParams(window.location.search).get("id") === String(member.id);
    const photoHTML = member.image
        ? `<img class="team-photo" src="${escapeHTML(API.assetUrl(member.image))}" alt="${name || "Team member"}">`
        : "";

    return `
        <div class="col-12">
            <article class="team-card team-profile-card${isSelected ? " is-selected" : ""}" id="team-profile-${index}" aria-labelledby="team-member-title-${index}"${isSelected ? ' tabindex="-1" data-selected-profile' : ""}>
                ${photoHTML}
                <div class="team-profile-content">
                    ${member.department ? `<span class="team-department">${escapeHTML(member.department)}</span>` : ""}
                    <h2 id="team-member-title-${index}">${name}</h2>
                    ${member.role ? `<p class="team-role">${escapeHTML(member.role)}</p>` : ""}
                    ${member.description ? `<section class="team-detail-group"><h3>About</h3><p>${escapeHTML(member.description)}</p></section>` : ""}
                    ${skillsHTML}
                    ${contactHTML}
                </div>
            </article>
        </div>
    `;
}

function scrollToSelectedTeamMember(team) {
    const selectedId = new URLSearchParams(window.location.search).get("id");
    if (!selectedId) {
        return;
    }

    const memberExists = team.some(member => String(member.id) === selectedId);
    if (!memberExists) {
        return;
    }

    const selectedProfile = document.querySelector("[data-selected-profile]");
    selectedProfile?.focus({ preventScroll: true });
    selectedProfile?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        block: "start"
    });
}

function parseTeamSkills(value) {
    let skills = value;

    if (typeof skills === "string") {
        try {
            skills = JSON.parse(skills);
        } catch (error) {
            console.warn("Unable to parse team skills:", error);
            return [];
        }
    }

    return Array.isArray(skills)
        ? skills.filter(skill => typeof skill === "string" && skill.trim())
        : [];
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
