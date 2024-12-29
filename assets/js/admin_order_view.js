window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

function update_order(id, status) {
	let order = fetchData('orders', id)
	if (status === 'a') {
		order.status = 'Approved';
		updateData('orders', order, id)
	} else if (status === 'r') {
		order.status = 'Rejected';
		updateData('orders', order, id)
	}

	alert("Order updated Successfullty");
	window.location.reload(true);
}

window.update_order = update_order;

let orders = fetchData('orders');
let i = 1
for (const key in orders) {
	let order = orders[key];

	let tableRow = document.createElement('tr');
	let td = document.createElement('td')
	td.textContent = i;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = order.userName;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.textContent = order.price;
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
	td.innerHTML = `<button class="btn btn-success" onclick="update_order('${key}', 'a')">Approve</button>`;
	tableRow.appendChild(td)

	td = document.createElement('td')
	td.innerHTML = `<button class="btn btn-danger" onclick="update_order('${key}', 'r')">Reject</button>`;
	tableRow.appendChild(td)

	document.getElementById('tableBody').appendChild(tableRow)
	i++
}
