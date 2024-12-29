window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn)) {
		window.location.href = 'admin_login.html';
		return
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const params = new URLSearchParams(window.location.search);

const form = document.getElementById('deletion_confirmation_form');
form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (!document.getElementById('deleteCheck').checked) {
		alert('Please confirm check first');
		return;
	}

	let idToDelete = params.get('id');
	let model = params.get('model');

	deleteData(model, idToDelete);
	window.location.href = 'user_order_view.html';

})



