// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const userName = document.getElementById('userName');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeatPassword');
const allForm = document.getElementById('registrationForm')

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
		(user) => user.email === email.value.trim()
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
		(user) => user.username === userName.value.trim()
	);
	if (user_object) {
		usernameError.textContent = "Username already exist.";
	} else {
		usernameError.textContent = "";
	}
});

password.addEventListener('blur', function () {
	const passwordError = document.getElementById('passwordError');
	const isValid = password.value.length > 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password.value);
	if (isValid) {
		passwordError.textContent = "";
	} else {
		passwordError.textContent = "Password must be more than 8 characters and contain a special character.";
	}
});

repeatPassword.addEventListener('blur', function () {
	const repeatPasswordError = document.getElementById('repeatPasswordError');
	if (repeatPassword.value === password.value) {
		repeatPasswordError.textContent = ""
	}
	else {
		repeatPasswordError.textContent = "Passwords do not match.";
	}
});

allForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const errors = document.querySelectorAll(name="error");
	for (let error of errors) {
		if (error.textContent) {
			return;
		}
	}

	let user_obj = {
		fullName: fullName.value.trim(),
		email: email.value.trim(),
		username: userName.value.trim(),
		password: password.value.trim(),
		isAdmin: true
	}

	writeData('users', user_obj);
	window.location.href = 'admin_login.html';

});
