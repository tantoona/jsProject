// import database functions
import { fetchData, writeData, updateData, deleteData } from "./firebase.js";

var categories = [];
var counter2 = 0;
var counter = 0;

window.onload = get_categories;



function get_categories() {
	if (fetchData("categories") != null) {
		categories = (Object.values(fetchData("categories")))
		console.log(categories)

		for (let i = 0; i < categories.length; i++) {
			var row = document.getElementById("categorytbl").insertRow(i);
			var data1 = row.insertCell(0);
			data1.innerHTML = categories[i];

			var btn = document.createElement('button');
			btn.addEventListener("click", function () { edit_category(i); });
			btn.textContent = 'EDIT';
			var data2 = row.insertCell(1);
			data2.appendChild(btn)

			var btn2 = document.createElement('button');
			btn2.addEventListener("click", function () { remove_category(i); });
			btn2.textContent = 'Remove';
			var data3 = row.insertCell(2);
			data3.appendChild(btn2);

			console.log(categories)
			console.log(typeof(categories))

		}

	}
}

function edit_category(row_index) {
	var new_name = prompt("Please enter the new name");
	for (let i = 0; i < categories.length; i++) {
		if (new_name.toLowerCase() == categories[i].toLowerCase()) {
			counter2 = counter2 + 1;
			break;
		}
	}

	if (counter2 > 0) {
		alert("name already exists")

		counter2 = 0

		edit_category(row_index)

	}
	else {
		categories[row_index] = new_name

		deleteData("categories", "")
		for(let i = 0; i < categories.length; i++)
		{
			writeData("categories", categories[i]);
		}
		alert("succesfully Edited");

		location.reload();

	}

}

function remove_category(row_index) {
	var decision = confirm("are you sure you want to remove this category")

	if (decision == true) {
		categories.splice(row_index, 1)
	}

	// console.log(categories);

	deleteData("categories", "")

		for(let i = 0; i < categories.length; i++)
		{
			writeData("categories", categories[i]);
		}

	alert("succesfully Removed");

	location.reload();

}
function add_category() {
	var new_name2 = prompt("Please enter the new name");
	for (let i = 0; i < categories.length; i++) {
		if (new_name2.toLowerCase() == categories[i].toLowerCase()) {
			counter = counter + 1;
			break;
		}
	}
	if (counter > 0) {
		alert("category already exists");
		counter = 0;
	}
	else {
		categories.push(new_name2)
		deleteData("categories", "")
		for(let i = 0; i < categories.length; i++)
		{
			writeData("categories", categories[i]);
		}
		alert("succesfully added");
		location.reload();
	}

}
window.add_category = add_category;

function clear_categories() {
	deleteData("categories", "");
	categories.length = 0;
	alert("all Categories are cleared")
	location.reload();
}
window.clear_categories = clear_categories;
