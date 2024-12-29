const databaseUrl = 'https://js-project-demo-95f84-default-rtdb.europe-west1.firebasedatabase.app/'

function writeData(path, obj, key = null) {
	const xhr = new XMLHttpRequest();
	let url = '';
	if (key) {
		url = databaseUrl + `/${path}/${key}.json`;
	} else {
		url = databaseUrl + `/${path}.json`;
	}

	const data = JSON.stringify(obj);

	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(data);

	if (xhr.status === 200) {
		let uniqueKey = JSON.parse(xhr.responseText).name;
		return uniqueKey;
	} else {
		console.error("Error saving data:", xhr.responseText);
	}
}

function fetchData(path, key = null) {
	const xhr = new XMLHttpRequest();
	let data;
	let url = '';
	if (key) {
		url = databaseUrl + `/${path}/${key}.json`;
	} else {
		url = databaseUrl + `/${path}.json`;
	}

	xhr.open("GET", url, false);
	xhr.send();

	if (xhr.status === 200) {
		data = JSON.parse(xhr.responseText);
		return data
	} else {
		console.error("Error fetching data:", xhr.responseText);
	}
}

function updateData(path, obj, key = null) {
	const xhr = new XMLHttpRequest();
	let url = '';
	if (key) {
		url = databaseUrl + `/${path}/${key}.json`;
	} else {
		url = databaseUrl + `/${path}/` + ".json";
	}

	const data = JSON.stringify(obj);

	xhr.open("PUT", url, false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(data);

	if (xhr.status === 200) {
		console.log("Data updated successfully!");
	} else {
		console.error("Error updating data:", xhr.responseText);
	}
}

function deleteData(path, key) {
	const xhr = new XMLHttpRequest();
	let url = databaseUrl + `/${path}/` + key + ".json";

	xhr.open("DELETE", url, false);
	xhr.send();

	if (xhr.status === 200) {
		console.log("Data deleted successfully!");
	} else {
		console.error("Error deleting data:", xhr.responseText);
	}
}

export {writeData, fetchData, updateData, deleteData};

