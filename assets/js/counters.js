// ========================================
// EJAR - COUNTERS CMS
// ========================================

let editingCounter = null;

// ========================================
// INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadCounters();

    document
        .getElementById("addCounter")
        .addEventListener("click", openCreateModal);

    document
        .getElementById("saveCounter")
        .addEventListener("click", saveCounter);

});

// ========================================
// LOAD COUNTERS
// ========================================

async function loadCounters(){

    try{

        const counters = await Api.get("/homepage/counters");

        const table = document.getElementById("counterTable");

        table.innerHTML = "";

        counters.forEach(counter => {

            table.innerHTML += `

            <tr>

                <td>${counter.id}</td>

                <td>${counter.number}</td>

                <td>${counter.title}</td>

                <td><i class="${counter.icon}"></i></td>

                <td>${counter.status}</td>

                <td>${counter.sort_order}</td>

                <td>

                    <button class="btn btn-warning btn-sm edit-btn"
                            data-id="${counter.id}">

                        Edit

                    </button>

                    <button class="btn btn-danger btn-sm delete-btn"
                            data-id="${counter.id}">

                        Delete

                    </button>

                </td>

            </tr>`;

        });

        document.querySelectorAll(".edit-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    editCounter(btn.dataset.id);

                });

            });

        document.querySelectorAll(".delete-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    deleteCounter(btn.dataset.id);

                });

            });

    }

    catch(err){

        console.error(err);

        alert("Unable to load counters.");

    }

}

// ========================================
// OPEN CREATE MODAL
// ========================================

function openCreateModal(){

    editingCounter = null;

    document.getElementById("counterForm").reset();

    new bootstrap.Modal(
        document.getElementById("counterModal")
    ).show();

}

// ========================================
// EDIT COUNTER
// ========================================

async function editCounter(id){

    try{

        const counters = await Api.get("/homepage/counters");

        const counter = counters.find(c => c.id == id);

        editingCounter = id;

        document.getElementById("number").value = counter.number || "";
        document.getElementById("title").value = counter.title || "";
        document.getElementById("icon").value = counter.icon || "";
        document.getElementById("sort_order").value = counter.sort_order || 0;
        document.getElementById("status").value = counter.status || "active";

        new bootstrap.Modal(
            document.getElementById("counterModal")
        ).show();

    }

    catch(err){

        console.error(err);

    }

}

// ========================================
// SAVE COUNTER
// ========================================

async function saveCounter(){

    const data = {

        number: document.getElementById("number").value,
        title: document.getElementById("title").value,
        icon: document.getElementById("icon").value,
        sort_order: document.getElementById("sort_order").value,
        status: document.getElementById("status").value

    };

    try{

        let result;

        if(editingCounter === null){

            result = await Api.post("/homepage/counters", data);

        }else{

            result = await Api.put(
                `/homepage/counters/${editingCounter}`,
                data
            );

        }

        alert(result.message);

        bootstrap.Modal
            .getInstance(
                document.getElementById("counterModal")
            )
            .hide();

        loadCounters();

    }

    catch(err){

        console.error(err);

        alert("Unable to save counter.");

    }

}

// ========================================
// DELETE COUNTER
// ========================================

async function deleteCounter(id){

    if(!confirm("Delete this counter?")) return;

    try{

        const result = await Api.delete(`/homepage/counters/${id}`);

        alert(result.message);

        loadCounters();

    }

    catch(err){

        console.error(err);

        alert("Unable to delete counter.");

    }

}