// Global variable
var users = [];
var errors = {};
// Constants
const addForm = document.getElementById("add_form");
const searchInput = document.getElementById("search-input");

// event
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    deleteErrors(errors);
    let formData = getFormData(e);

    if (!validateFormData(formData)) {
        let types = addForm.getAttribute("name");
        if (types == 0) {
            addUser(formData);
            emptyForm(e);
            generateUI();
        }

    } else {
        addErrors(errors);
    }

});

searchInput.addEventListener("keyup", search);

// User class

class User {
    constructor({ id, name, surname, age }) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.age = age;
    }
    save() {
        users.push(this);
        return this.get();
    }
    get() {
        return {
            id: this.id,
            name: this.name,
            surname: this.surname,
            age: this.age
        };
    }
}

// User functions

function addUser(credentials) {

    return (new User(credentials)).save();
}

function deleteUser(e) {
    let user_id = Number(e.id.split("_").pop());
    users = users.filter((user) => user.id !== user_id);
    generateUI();
}


function editUser(credentials, selectedUser) {
    selectedUser.name = credentials.name;
    selectedUser.surname = credentials.surname;
    selectedUser.age = credentials.age;

    let objIndex = users.findIndex((user => user.id == selectedUser.id));

    users[objIndex] = selectedUser;
}

function search(e) {
    let name = e.target.value;
    if (name.length) {
        let searched = users.find(user => user.name.includes(name));
        generateUI([searched]);
    } else {
        generateUI([]);
    }
}

// Helpers
function getFormData(e, user_id) {

    let childElements = Array.from(e.target.children);
    // Remove button
    childElements.pop();
    let obj = {};

    childElements.map(child => {
        let id = child.lastElementChild.id;
        let value = child.lastElementChild.value;
        obj[id] = value;
        obj["id"] = user_id ? user_id : users[users.length - 1] ? (users[users.length - 1].id + 1) : 1;

    });

    return obj;
}


function generateUI(searched = []) {
    const tableBody = document.getElementById("table_body");
    const tableHead = document.getElementById("tr_head");
    addForm.lastElementChild.textContent = "submit";

    tableHead.innerHTML = "";
    tableBody.innerHTML = "";

    let list = searched.length ? searched : users;

    if (list.length) {
        Object.keys(users[0]).forEach(key => {
            const th = document.createElement("th");

            th.textContent = key;

            tableHead.append(th);
        });
        list.forEach(user => {
            if (user && Object.keys(user).length) {
                const trBody = document.createElement("tr");

                trBody.addEventListener("click", getRowData);

                trBody.innerHTML = `
                    <td scope="row">${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>
                        <button id="edit_${user.id}" onclick="getRowData(this)" type="button" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button id="delete_${user.id}" onclick="deleteUser(this)" type="button" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tableBody.append(trBody);
            }
        });
    }
    else {
        tableBody.innerHTML = "Data not found"
    }
}

function validateFormData(formData) {
    let err = errors;
    Object.keys(formData).map(key => {
        if (!String(formData[key])) {
            err[key] = "Dont be blank";
        }
    });

    errors = err;
    return checkErrors(err);
}

function emptyForm(e) {
    let childElements = Array.from(e.target.children);
    childElements.pop();
    childElements.map(child => {
        child.lastElementChild.value = '';
    });
}

function addErrors(errors) {
    Object.keys(errors).map(key => {
        let errSpan = document.createElement("span");
        errSpan.style.color = "red";
        errSpan.textContent = errors[key];
        document.getElementById(key).parentElement.append(errSpan);
    })
}

function deleteErrors(err) {
    Object.keys(err).map(key => {
        document.getElementById(key).parentElement.lastElementChild.remove();
    });
    errors = {}
}

function checkErrors(errors) {
    return Object.keys(errors).length ? true : false;
}

function getRowData(e) {
    let user_id = Number(String(e.id).split("_").pop());
    fillForm({ ...users.filter((user) => user.id === user_id)[0] }, user_id, users.filter((user) => user.id === user_id)[0]);
    addForm.lastElementChild.textContent = "edit";
    addForm.setAttribute("name", "1");
}

function fillForm(selected, user_id, user) {
    let selectedUser = selected;
    Array.from(addForm.children).map(e => {
        let element = e.lastElementChild
        if (element && element.id && selectedUser[element.id]) {
            if (element.type == "number") {
                element.value = selectedUser[element.id];
                return;
            }
            element.value = selectedUser[element.id];
        }
    });
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        deleteErrors(errors);
        let formData = getFormData(e, user_id);

        let types = addForm.getAttribute("name");
        if (types == "0") {
            addUser(formData);
            emptyForm(e);
            generateUI();
        } else if (types == "1") {
            editUser(formData, user);
            emptyForm(e);
            generateUI();
        }

    });
}

// Main Function
function init() {
    generateUI();
}


init();