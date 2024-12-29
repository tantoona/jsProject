window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn)) {
		window.location.href = 'user_login.html';
		return
	}
}

// Import database functions
import { fetchData, deleteData, updateData, writeData } from "./firebase.js";

const userId = JSON.parse(sessionStorage.getItem('loginSession')).userId;
const userName = JSON.parse(sessionStorage.getItem('loginSession')).username;
let grandTotal = 0;

function refreshCartItems() {
	// reset rows
	document.getElementById('tableBody').innerHTML = '';

	let cart = fetchData('users/'+userId+'/cart');
	let i = 1;

	// Loop through cart items
	for (const productId in cart) {
		let cartItem = cart[productId];

		// Create a table row for each order
		let tableRow = document.createElement('tr');
		tableRow.setAttribute('product-id', productId);

		// Add index (order #)
		let td = document.createElement('td');
		td.textContent = i++;
		tableRow.appendChild(td);

		// Add product name
		td = document.createElement('td');
		td.textContent = cartItem.name;
		tableRow.appendChild(td);

		// Add quantity
		td = document.createElement('td');
		td.textContent = cartItem.quantity;
		tableRow.appendChild(td);

		// Add price per unit
		td = document.createElement('td');
		td.textContent = cartItem.price;
		tableRow.appendChild(td);

		// Calculate total price for this order
		let totalPrice = cartItem.quantity * cartItem.price;
		td = document.createElement('td');
		td.textContent = totalPrice;
		tableRow.appendChild(td);

		// Add "Delete" button in the last column
		td = document.createElement('td');
		let deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete';
		deleteButton.classList.add('btn', 'btn-danger');
		td.appendChild(deleteButton);
		tableRow.appendChild(td);

		// Add table row to the table body
		document.getElementById('tableBody').appendChild(tableRow);

		// Add the total price of this order to the grand total
		grandTotal += totalPrice;

		// Attach the event listener to the delete button
		deleteButton.addEventListener('click', function () {
			cart = removeProductFromCart(cart, productId);
			updateCart(cart, tableRow);
		});
		
	}

	// Update the grand total in the UI
	document.getElementById('grandTotal').textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", refreshCartItems());

function removeProductFromCart(cart, productIdToRemove) {
	for (const key in cart) {
		if (key === productIdToRemove) {
			delete cart[key];
			return cart;
		}
	}
	return cart;
}

// Delete product from order
function updateCart(cart, rowElement) {
	// Remove the row from the table
	rowElement.remove();

	// Remove the order from Firebase
	updateData('users/'+userId+'/cart', cart);

	// refresh order
	refreshCartItems();

	// Recalculate the grand total
	recalculateGrandTotal();
}

// Function to recalculate the grand total after deletion
function recalculateGrandTotal() {
	let rows = document.getElementById('tableBody').getElementsByTagName('tr');
	let grandTotal = 0; // Reset the grand total

	for (let row of rows) {
		let totalCell = row.cells[4]; // Assuming the total price is in the 5th column
		let totalPrice = parseFloat(totalCell.textContent.replace('$', ''));
		grandTotal += totalPrice;
	}

	console.log("Updated grand total:", grandTotal); // Debugging line

	// Update the grand total in the UI
	document.getElementById('grandTotal').textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}

document.getElementById('buyButton').addEventListener('click', ()=> {
	let cart = fetchData('users/' + userId + '/cart');
	let order = {
		userId: userId,
		userName: userName,
		price: grandTotal,
		status: 'Pending',
		date: new Date().toISOString(),
		products: Object.keys(cart)
	};

	writeData('orders', order);
	alert('Order Placed Successfully');

	window.location.href = 'user_order_view.html'
})
