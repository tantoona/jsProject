window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const categories = fetchData('categories');
console.log(categories)

let categoryName = document.getElementById('create_category_name');
categoryName.addEventListener('blur', ()=>{
	let nameError = document.getElementById('nameError');
	let categories_object = Object.values(categories).find(
		(category) => category.name === categoryName.value
	);
	if (categories_object) {
		nameError.textContent = 'Name already exist';
	} else {
		nameError.textContent = '';
	}
})

document.forms[0].addEventListener('submit', (e) => {
	e.preventDefault();
	let categoryName = document.getElementById('create_category_name').value.trim();
	
	const errors = document.querySelectorAll(name = "error");
	for (let error of errors) {
		if (error.textContent) {
			return;
		}
	}

	let category = {
		name: categoryName,
	}

	writeData('categories', category);
	window.location.href = 'admin_category_view.html'
});


