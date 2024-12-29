// Import database functions
import { fetchData, deleteData, updateData, writeData } from "./firebase.js";

function refreshOrder() {
	// reset rows
	document.getElementById('tableBody').innerHTML = '';

	// Fetch user orders from Firebase
	let orders = fetchData('orders'); // Fetch the 'orders' collection
	let grandTotal = 0; // Initialize grand total
	let i = 1; // Order index

	// Loop through orders and display them in the table
	for (const orderId in orders) {
		let order = orders[orderId]; // Get orders for the current user

		// Loop through the products in each user's order
		for (const productId of Object.values(order.products)) {
			let product = fetchData('products', productId);
			// Create a table row for each order
			let tableRow = document.createElement('tr');
			tableRow.setAttribute('product-id', productId);

			// Add index (order #)
			let td = document.createElement('td');
			td.textContent = i++;
			tableRow.appendChild(td);

			// Add product name
			td = document.createElement('td');
			td.textContent = product.name;
			tableRow.appendChild(td);

			// Add quantity
			td = document.createElement('td');
			td.textContent = product.quantity;
			tableRow.appendChild(td);

			// Add price per unit
			td = document.createElement('td');
			td.textContent = product.price;
			tableRow.appendChild(td);

			// Calculate total price for this order
			let totalPrice = product.quantity * product.price;
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
				order = removeProductFromOrder(order, productId);
				updateOrder(order, orderId, tableRow);
			});
		}
	}

	// Update the grand total in the UI
	document.getElementById('grandTotal').textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", refreshOrder());

function removeProductFromOrder(order, productIdToRemove) {
	for (const key in order.products) {
		if (order.products[key] === productIdToRemove) {
			delete order.products[key];
			return order;
		}
	}
	return order;
}

// Handle "Buy" button click
document.getElementById('buyButton').addEventListener('click', async function () {
	let products = fetchData('products');
	let boughtProducts = Object.keys(products);
	let totalPrice = 0;
	for (const product of Object.values(products)) {
		totalPrice += Number(product.price)
	}

	let order = {
		userId: JSON.parse(sessionStorage.getItem('loginSession')).userId,
		username: JSON.parse(sessionStorage.getItem('loginSession')).username,
		date: new Date().toISOString(),
		status: 'Pending',
		products: boughtProducts,
		totalPrice: totalPrice
	}

	updateData('orders', order, '-OFD8VpR1cWsWqrsHweP')

	// writeData('orders', order);
	// if (!orders || Object.keys(orders).length === 0) {
	// 	alert("No orders to place!");
	// 	return;
	// }

	// let previousOrders = fetchData('previousOrders'); // Fetch existing previous orders or initialize an empty object

	// // Move current orders to previousOrders and delete orders from Firebase
	// for (const user in orders) {
	// 	if (!previousOrders[user]) {
	// 		previousOrders[user] = {}; // Initialize user's previous orders if not present
	// 	}

	// 	// Add user's current orders to previousOrders
	// 	Object.assign(previousOrders[user], orders[user]);

	// 	// Delete user's orders from Firebase
	// 	deleteData('orders', user);
	// }

	// // Save updated previousOrders to Firebase
	// updateData('previousOrders', previousOrders);

	// // Reset UI and show confirmation
	// orders = {}; // Clear local orders
	// document.getElementById('tableBody').innerHTML = ''; // Clear the cart
	// document.getElementById('grandTotal').textContent = 'Grand Total: $0.00'; // Reset grand total
	// document.getElementById('orderStatus').innerHTML = 'Pending (waiting for admins to approve your order)';
	// alert("Your order's placed successfully!");
});

// Delete product from order
function updateOrder(order, orderId, rowElement) {
	// Remove the row from the table
	rowElement.remove();

	// Remove the order from Firebase
	updateData('orders', order, orderId)

	// refresh order
	refreshOrder();

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
