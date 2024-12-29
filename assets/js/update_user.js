window.onload = function checkLoginStatus() {
	let loginSession = sessionStorage.getItem('loginSession');
	if (!(loginSession && JSON.parse(loginSession).loggedIn && JSON.parse(loginSession).isAdmin)) {
		window.location.href = 'admin_login.html';
		return
	}
}

const adminObject = JSON.parse(sessionStorage.getItem('loginSession'));

// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const userName = document.getElementById('userName');
const isAdminCheckBox = document.getElementById('isAdmin');
const allForm = document.getElementById('registrationForm');
const params = new URLSearchParams(window.location.search);

const userObject = fetchData('users', params.get('id'));

fullName.value = userObject.fullName;
email.value = userObject.email;
userName.value = userObject.username;

if (userObject.isAdmin) {
	isAdminCheckBox.setAttribute('checked', 'true');
}

fullName.addEventListener('input', () => {
	const fullNameError = document.getElementById('fullNameError');
	if (fullName.value.trim().split(' ').filter(name => name).length < 3) {
		fullNameError.textContent = "Full name must contain at least 3 words.";
	}
	else {
		fullNameError.textContent = "";
	}
});

email.addEventListener('input', () => {
	const emailError = document.getElementById('emailError');
	const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
	if (isValid) {
		emailError.textContent = "";
	}
	else {
		emailError.textContent = "Please enter a valid email address.";
	}
});

email.addEventListener('blur', () => {
	const emailError = document.getElementById('emailError');
	let users = fetchData('users');
	let user_object = Object.values(users).find(
		(user) => user.email === email.value.trim() && user.email !== userObject.email
	);
	if (user_object) {
		emailError.textContent = "Email already exist.";
	} else {
		emailError.textContent = "";
	}
});

userName.addEventListener('input', () => {
	const usernameError = document.getElementById('usernameError');
	const isValid = /^[a-zA-Z0-9]+$/.test(userName.value);
	if (isValid) {
		usernameError.textContent = "";
	} else {
		usernameError.textContent = "Username must not contain special characters.";
	}
});

userName.addEventListener('blur', () => {
	let usernameError = document.getElementById('usernameError');
	let users = fetchData('users');
	let user_object = Object.values(users).find(
		(user) => user.username === userName.value.trim() && user.username !== userObject.username
	);
	if (user_object) {
		usernameError.textContent = "Username already exist.";
	} else {
		usernameError.textContent = "";
	}
});

allForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const errors = document.querySelectorAll(name = "error");
	for (let error of errors) {
		if (error.textContent) {
			return;
		}
	}

	let user_obj = {
		fullName: fullName.value.trim(),
		email: email.value.trim(),
		username: userName.value.trim(),
		isAdmin: isAdminCheckBox.checked
	}
	
	updateData('users', user_obj, params.get('id'));
	window.location.href = 'admin_users_view.html';

});