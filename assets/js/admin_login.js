// check login status
window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (loginSession) {
		loginSession = JSON.parse(loginSession);
	}
	if (loginSession && loginSession.loggedIn && loginSession.isAdmin) {
		window.location.href = 'user_product_view.html';
	}
}

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
	e.preventDefault();
	let valid = true;
	clearErrors();

	if (username.value.trim() === "") {
		showError(username, "Username is required");
		valid = false;
	}
	if (password.value.trim() === "") {
		showError(password, "Password is required");
		valid = false;
	}
	if (!valid) {
		return
	}

	let users = fetchData('users');
	let user_object = Object.entries(users).find(
		([userId, user]) => user.username === username.value.trim() && user.password === password.value.trim() && user.isAdmin === true
	);
	if (user_object) {
		let [userId, user] = user_object
		sessionStorage.setItem('loginSession',
			JSON.stringify({
				loggedIn: true,
				isAdmin: true,
				userId: userId,
				username: user.username
			})
		);
		window.location.href = 'admin_dashboard.html'
	} else {
		showError(username, "Username or Password is incorrect");
	}

});
function showError(input, message) {
	const error = document.createElement("p");
	error.className = "error-message";
	error.textContent = message;
	input.parentElement.appendChild(error);
}
function clearErrors() {
	const errors = document.querySelectorAll(".error-message");
	errors.forEach((error) => error.remove());
}


