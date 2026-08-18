// ========================================
// LOAD HERO
// ========================================

function hasContent(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
}

async function loadHero(){

    try{

        const slides = await Api.publicGet("/homepage/public/hero");

        if (!Array.isArray(slides) || !slides.length) return;

        const existingSlides =
            document.querySelectorAll("#heroSlider .swiper-slide");

        if (!existingSlides.length) return;

        slides.slice(0, existingSlides.length).forEach((slide, index) => {

            const slideEl = existingSlides[index];
            const inner = slideEl.querySelector(".slide-inner");
            const heading = slideEl.querySelector("h1, h2");
            const subtitle = slideEl.querySelector("h6");
            const text = slideEl.querySelector("p");
            const buttons = slideEl.querySelector(".buttons");

            if (inner && hasContent(slide.image)) {
                inner.style.backgroundImage =
                    `url('${API.assetUrl(slide.image)}')`;
            }

            if (subtitle && hasContent(slide.subtitle)) {
                subtitle.textContent = slide.subtitle;
            }

            if (heading && hasContent(slide.title)) {
                heading.textContent = slide.title;
            }

            if (text && hasContent(slide.description)) {
                text.textContent = slide.description;
            }

            if (buttons) {
                const buttonHtml = [];

                if (hasContent(slide.button1_text)) {
                    buttonHtml.push(`
                        <div class="green-button">
                            <a href="${slide.button1_url || '#'}">${slide.button1_text}</a>
                        </div>
                    `);
                }

                if (hasContent(slide.button2_text)) {
                    buttonHtml.push(`
                        <div class="orange-button">
                            <a href="${slide.button2_url || '#'}">${slide.button2_text}</a>
                        </div>
                    `);
                }

                if (buttonHtml.length) {
                    buttons.innerHTML = buttonHtml.join("");
                }
            }

        });

    }

    catch(err){

        console.error('Hero error', err);

    }

}

// ========================================
// LOAD ABOUT
// ========================================

async function loadAbout(){

    try{

        const about = await Api.publicGet("/homepage/public/about");

        const section =
            document.getElementById('aboutSection');

        if(!section || !hasContent(about.heading)) return;

        section.innerHTML = `

        <div class="container py-5">

            <div class="row align-items-center">

                <div class="col-lg-6">

                    ${hasContent(about.image)
                        ? `<img src="${API.assetUrl(about.image)}"
                                class="img-fluid rounded"
                                alt="${about.heading || 'EJAR SOLUTIONS'}">`
                        : ''}

                </div>

                <div class="col-lg-6">

                    <h6 class="text-success">${about.subtitle || ''}</h6>

                    <h2>${about.heading || ''}</h2>

                    <p>${about.description || ''}</p>

                    <div class="mb-3">

                        <strong>${about.experience_years || '0'}+ Years Experience</strong>

                    </div>

                    ${about.button_text
                        ? `<a href="${about.button_url || '#'}"
                              class="btn btn-success">
                              ${about.button_text}
                           </a>`
                        : ''}

                </div>

            </div>

        </div>`;

    }

    catch(err){

        console.error('About error', err);

    }

}

// ========================================
// LOAD COUNTERS
// ========================================

async function loadCounters(){

    try{

        const counters = await Api.publicGet("/homepage/public/counters");

        const section =
            document.getElementById('countersSection');

        if(!section || !Array.isArray(counters) || !counters.length) return;

        section.innerHTML = `

        <div class="container py-5">

            <div class="row text-center">

                ${counters.map(counter => `

                    <div class="col-md-3 mb-4">

                        <i class="${counter.icon} fa-2x text-success mb-2"></i>

                        <h2>${counter.number}</h2>

                        <p>${counter.title}</p>

                    </div>

                `).join('')}

            </div>

        </div>`;

    }

    catch(err){

        console.error('Counters error', err);

    }

}

// ========================================
// LOAD WHY CHOOSE US
// ========================================

async function loadWhy(){

    try{

        const items = await Api.publicGet("/homepage/public/why");

        const section =
            document.getElementById('whySection');

        if(!section || !Array.isArray(items) || !items.length) return;

        section.innerHTML = `

        <div class="container py-5">

            <div class="text-center mb-5">

                <h2>Why Choose Us</h2>

            </div>

            <div class="row">

                ${items.map(item => `

                    <div class="col-lg-4 mb-4">

                        <div class="card h-100 shadow-sm border-0">

                            ${item.image
                                ? `<img src="${API.assetUrl(item.image)}"
                                       class="card-img-top">`
                                : ''}

                            <div class="card-body text-center">

                                <i class="${item.icon} fa-2x text-success mb-3"></i>

                                <h5>${item.title}</h5>

                                <p>${item.description}</p>

                            </div>

                        </div>

                    </div>

                `).join('')}

            </div>

        </div>`;

    }

    catch(err){

        console.error('Why error', err);

    }

}

// ========================================
// LOAD PARTNERS
// ========================================

async function loadPartners(){

    try{

        const partners = await Api.publicGet("/homepage/public/partners");

        const section =
            document.getElementById('partnersSection');

        if(!section || !Array.isArray(partners) || !partners.length) return;

        section.innerHTML = `

        <div class="container py-5 text-center">

            <h2 class="mb-5">Our Partners</h2>

            <div class="row justify-content-center align-items-center">

                ${partners.map(partner => `

                    <div class="col-6 col-md-3 mb-4">

                        ${partner.website
                            ? `<a href="${partner.website}" target="_blank">`
                            : ''}

                        <img src="${API.assetUrl(partner.logo)}"
                             class="img-fluid"
                             alt="${partner.name}">

                        ${partner.website ? '</a>' : ''}

                    </div>

                `).join('')}

            </div>

        </div>`;

    }

    catch(err){

        console.error('Partners error', err);

    }

}

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    loadHero();
    loadAbout();
    loadCounters();
    loadWhy();
    loadPartners();

});
