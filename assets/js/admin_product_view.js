window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

let products = fetchData('products');
let i = 1
for (const key in products) {
	let product = products[key];

	let tableRow = document.createElement('tr');
	let td = document.createElement('td')
	td.textContent = i;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = product.name;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = product.description;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = product.category;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = product.price;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = product.quantity;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-success" href="update_product.html?id=${key}">Update</a>`;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-danger" href="delete_confirmation.html?id=${key}&model=products">Delete</a>`;
	tableRow.appendChild(td)

	document.getElementById('tableBody').appendChild(tableRow)
	i ++
}


