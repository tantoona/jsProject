import { fetchData, writeData, updateData } from "./firebase.js";

const itemsRow = document.getElementById('itemsRow');
const products = fetchData('products');
let innerColumns = '';

for (const key in products) {
	const product = products[key];
	innerColumns += `
		<div class="col-lg-3 col-md-4 col-sm-6 col-xm-12">
			<div class="card">
				<img src="${product.image}" class="card-img-top" alt="img1" style="height: 200px; width: 311px; object-fit: cover;">
				<div class="card-body">
					<h5 class="card-title">${product.name}</h5>
					<p class="card-text"><span class="badge rounded-pill text-bg-light">${product.description}</span></p>
					<p class="price"><span class="badge rounded-pill text-bg-primary">$${product.price}</span></p>
					<div class="d-flex justify-content-between">
						<span class="category">${product.category}</span>
						<span class="quantity"><span class="badge rounded-pill text-bg-warning">${product.quantity}</span> in stock</span>
					</div>
					<div class="d-grid gap-2 my-3">
						<button type="button" class="btn btn-outline-primary add-to-cart" data-id="${key}">Add to Cart</button>
						<button type="button" class="btn btn-outline-primary add-to-wishlist" data-id="${key}">Add to Wish List</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

itemsRow.innerHTML = innerColumns;

function getUserOrders(userId) {
	let orders = fetchData('orders');
	for (const key in orders) {
		const order = orders[key];
		if (orders[key].userId !== userId) {
			delete orders[key]
		}
	}

	return orders
}

// Attach event listeners to "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
	button.addEventListener('click', async (event) => {
		const loginSession = sessionStorage.getItem('loginSession');

		if (!loginSession || !JSON.parse(loginSession).loggedIn) {
			alert('Please log in to add items to your cart.');
			window.location.href = 'user_login.html';
			return;
		}

		const userId = JSON.parse(loginSession).userId;
		const cart = fetchData('users/'+userId+'/cart') || {};
		const productId = event.target.getAttribute('data-id');

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
});

// Attach event listeners to "Add to Wish List" buttons
const addToWishListButtons = document.querySelectorAll('.add-to-wishlist');
addToWishListButtons.forEach(button => {
	button.addEventListener('click', async (event) => {
		const loginSession = sessionStorage.getItem('loginSession');

		if (!loginSession || !JSON.parse(loginSession).loggedIn) {
			alert('Please log in to add items to your cart.');
			window.location.href = 'user_login.html';
			return;
		}

		const userId = JSON.parse(loginSession).userId;
		const wishList = fetchData('users/' + userId + '/wishlist') || {};
		const productId = event.target.getAttribute('data-id');

		wishList[productId] = {
			name: products[productId].name,
			price: products[productId].price,
			quantity: 1,
		};

		updateData('users/' + userId + '/wishlist', wishList);

		alert("Added product to wishlist");
	});
});


window.onload = get_categories;

function get_categories() {
	const categories = fetchData('categories')
	let menu = document.getElementById("dropdown");
	for (const key in categories) {
		const category = categories[key]

		let data1 = document.createElement('li');
		data1.innerHTML = category.name;
		data1.className = "dropdown-item"
		data1.addEventListener("click", function (event) { filterlist(event); })
		menu.appendChild(data1);
	}
}

function filterlist(event) {
	let dropdownButton = document.getElementById("dropdown-item");
	let products = fetchData('products')
	console.log(event.target.outerText)
	itemsRow.innerHTML = ""
	innerColumns = ""


	dropdownButton.textContent = event.target.outerText;
	clearfilter.style.display = 'inline';

	for (const key in products) {
		const product = products[key]
		if (event.target.outerText == product.category) {

			innerColumns += `
				<div class="col-lg-3 col-md-4 col-sm-6 col-xm-12">
			<div class="card">
				<img src="${product.image}" class="card-img-top" alt="img1">
				<div class="card-body">
					<h5 class="card-title">${product.name}</h5>
					<p class="card-text"><span class="badge rounded-pill text-bg-light">${product.description}</span></p>
					<p class="price"><span class="badge rounded-pill text-bg-primary">$${product.price}</span></p>
					<div class="d-flex justify-content-between">
						<span class="category">${product.category}</span>
						<span class="quantity"><span class="badge rounded-pill text-bg-warning">${product.quantity}</span> in stock</span>
					</div>
					<div class="d-grid gap-2 my-3">
						<button type="button" class="btn btn-outline-primary add-to-cart" data-id="${key}">Add to Cart</button>
						<button type="button" class="btn btn-outline-primary add-to-wishlist" data-id="${key}">Add to Wish List</button>
					</div>
				</div>
			</div>
		</div>
			`;
		}
	}
	itemsRow.innerHTML = innerColumns;
}

function clear_filter() {
	let dropdownButton = document.getElementById("dropdown-item");
	let products = fetchData('products')

	dropdownButton.textContent = "Filter By Category";
	itemsRow.innerHTML = ""
	innerColumns = ""
	clearfilter.style.display = 'none';

	for (const key in products) {
		const product = products[key];

		innerColumns += `
			<div class="col-lg-3 col-md-4 col-sm-6 col-xm-12">
			<div class="card">
				<img src="${product.image}" class="card-img-top" alt="img1">
				<div class="card-body">
					<h5 class="card-title">${product.name}</h5>
					<p class="card-text"><span class="badge rounded-pill text-bg-light">${product.description}</span></p>
					<p class="price"><span class="badge rounded-pill text-bg-primary">$${product.price}</span></p>
					<div class="d-flex justify-content-between">
						<span class="category">${product.category}</span>
						<span class="quantity"><span class="badge rounded-pill text-bg-warning">${product.quantity}</span> in stock</span>
					</div>
					<div class="d-grid gap-2 my-3">
						<button type="button" class="btn btn-outline-primary add-to-cart" data-id="${key}">Add to Cart</button>
						<button type="button" class="btn btn-outline-primary add-to-wishlist" data-id="${key}">Add to Wish List</button>
					</div>
				</div>
			</div>
		</div>
		`;
	}
	itemsRow.innerHTML = innerColumns;

}
window.clear_filter = clear_filter;



