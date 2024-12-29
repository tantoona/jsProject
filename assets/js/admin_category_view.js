window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

let categories = fetchData('categories');
let i = 1
for (const key in categories) {
	let category = categories[key];

	let tableRow = document.createElement('tr');
	let td = document.createElement('td')
	td.textContent = i;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = category.name;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-success" href="update_category.html?id=${key}">Update</a>`;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-danger" href="delete_confirmation.html?id=${key}&model=categories">Delete</a>`;
	tableRow.appendChild(td)

	document.getElementById('tableBody').appendChild(tableRow)
	i++
}


