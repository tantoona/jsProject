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

// reset rows
refreshWishListItems()

function refreshWishListItems() {
	// reset rows
	document.getElementById('tableBody').innerHTML = '';

	let wishList = fetchData('users/' + userId + '/wishlist');
	let i = 1;

	// Loop through cart items
	for (const productId in wishList) {
		let wishListItem = wishList[productId];

		// Create a table row for each order
		let tableRow = document.createElement('tr');
		tableRow.setAttribute('product-id', productId);

		// Add index (order #)
		let td = document.createElement('td');
		td.textContent = i++;
		tableRow.appendChild(td);

		// Add product name
		td = document.createElement('td');
		td.textContent = wishListItem.name;
		tableRow.appendChild(td);

		// Add price per unit
		td = document.createElement('td');
		td.textContent = wishListItem.price;
		tableRow.appendChild(td);

		td = document.createElement('td');
		let addButton = document.createElement('button');
		addButton.textContent = 'Add';
		addButton.classList.add('btn', 'btn-success');
		td.appendChild(addButton);
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

		addButton.addEventListener('click', ()=>{
			const cart = fetchData('users/'+userId+'/cart') || {};
			let products = fetchData('products');

			if (cart[productId]) {
				cart[productId].quantity += 1;
			} else {
				cart[productId] = {
					name: products[productId].name,
					price: products[productId].price,
					quantity: 1,
				};
			}
			updateData('users/'+userId+'/cart', cart);

			alert("Added product to cart");

		});

		// Attach the event listener to the delete button
		deleteButton.addEventListener('click', function () {
			wishList = removeProductFromwishList(wishList, productId);
			updateWishList(wishList, tableRow);
		});

	}
}

document.addEventListener("DOMContentLoaded", refreshWishListItems());

function removeProductFromwishList(cart, productIdToRemove) {
	for (const key in cart) {
		if (key === productIdToRemove) {
			delete cart[key];
			return cart;
		}
	}
	return cart;
}

// Delete product from order
function updateWishList(wishList, rowElement) {
	rowElement.remove();
	updateData('users/' + userId + '/wishlist', wishList);
	refreshWishListItems();

}

