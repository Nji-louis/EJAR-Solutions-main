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

    loadCounters();
    loadWhy();
    loadPartners();

});
