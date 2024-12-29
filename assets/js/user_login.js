// Check login status
window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (loginSession) {
		loginSession = JSON.parse(loginSession);
	}
	if (loginSession && loginSession.loggedIn) {
		window.location.href = 'user_product_view.html';
	}
}

// Import database functions
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
		return;
	}

	let users = fetchData('users');
	let user_object = Object.entries(users).find(
		([userId, user]) => user.username === username.value.trim() && user.password === password.value.trim()
	);
	if (user_object) {
		// Store user data in sessionStorage
		let [userId, user] = user_object;
		sessionStorage.setItem('loginSession',
			JSON.stringify({
				loggedIn: true,
				username: user.username,
				userId: userId,
				isAdmin: user.isAdmin || false
			})
		);
		window.location.href = 'index.html?userId=' + userId;
	} else {
		showError(username, "Username or Password is incorrect");
	}

});

// Show error message
function showError(input, message) {
	const error = document.createElement("p");
	error.className = "error-message";
	error.textContent = message;
	input.parentElement.appendChild(error);
}

// Clear all error messages
function clearErrors() {
	const errors = document.querySelectorAll(".error-message");
	errors.forEach((error) => error.remove());
}
