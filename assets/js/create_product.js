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
for (const key in categories) {

	const category = categories[key];
	let option = document.createElement('option');
	option.value = category.name;
	option.textContent = category.name;
	document.getElementById('create_product_category').appendChild(option);
}

document.forms[0].addEventListener('submit', (e) => {
	e.preventDefault();
	let productName = document.getElementById('create_product_name').value;
	let productDescription = document.getElementById('create_product_description').value;
	let productPrice = document.getElementById('create_product_price').value;
	let productQuantity = document.getElementById('create_product_quantity').value;
	let productCategory = document.getElementById('create_product_category').value;
		
	let productImage = document.getElementById('create_product_image').value;

	let product = {
		name: productName,
		description: productDescription,
		price: productPrice,
		quantity: productQuantity,
		category: productCategory,
		image: productImage
	}

	writeData('products', product);
	window.location.href = 'admin_product_view.html'
});
