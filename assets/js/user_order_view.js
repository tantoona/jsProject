window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const userId = JSON.parse(sessionStorage.getItem('loginSession')).userId;
const userName = JSON.parse(sessionStorage.getItem('loginSession')).username;

function getProductName(id) {
	return fetchData('products', id).name
}

let orders = fetchData('orders');
let i = 1
for (const key in orders) {
	let order = orders[key];
	if (!order.userId === userId) {
		continue
	}

	let tableRow = document.createElement('tr');
	let td = document.createElement('td')
	td.textContent = i;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = order.price;
	tableRow.appendChild(td)

	td = document.createElement('td')
	let products = '';
	for (const productId of order.products) {
		products += getProductName(productId);
		products += ', ';
	}
	td.textContent = products;
	tableRow.appendChild(td)

	td = document.createElement('td')
	if (order.status === 'Pending') {
		td.innerHTML = '<span class="badge rounded-pill text-bg-warning">Pending</span>';
	} else if (order.status === 'Approved') {
		td.innerHTML = '<span class="badge rounded-pill text-bg-success">Approved</span>';
	} else if (order.status === 'Rejected') {
		td.innerHTML = '<span class="badge rounded-pill text-bg-danger">Rejected</span>';
	}
	tableRow.appendChild(td);

	td = document.createElement('td')
	td.innerHTML = `<a class="btn btn-danger" href="user_delete_conf.html?id=${key}&model=orders">Cancel</a>`;
	tableRow.appendChild(td)

	document.getElementById('tableBody').appendChild(tableRow)
	i++
}
