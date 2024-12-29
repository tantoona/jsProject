window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const adminObject = JSON.parse(sessionStorage.getItem('loginSession'));

let users = fetchData('users');

delete users[adminObject.userId];

let i = 1
for (const key in users) {
	let user = users[key];

	let tableRow = document.createElement('tr');
	let td = document.createElement('td')
	td.textContent = i;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = user.fullName;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = user.username;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = user.email;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = user.isAdmin;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-success" href="update_user.html?id=${key}">Update</a>`;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-danger" href="delete_confirmation.html?id=${key}&model=users">Delete</a>`;
	tableRow.appendChild(td)

	document.getElementById('tableBody').appendChild(tableRow)
	i++
}



