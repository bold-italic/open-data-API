/**

    Description: Builds an AJAX search form for a dataset that queries the City
    of Winnipeg Open Data API and displays search results below the form.

**/

// Add the event listener to run when the page is loaded.
document.addEventListener("DOMContentLoaded", load);

// Add the event listener for the search request submit.
function load() {
	document.querySelector("form").addEventListener("submit", loadData);
}

// Determine if a text field element has input.
// Retrieve the data using the fetch API.
function loadData(e) {
	let textField = document.getElementById("type").value;

	e.preventDefault();

	if (textField == null || textField.trim() == "" ) {
		return false;
	}

	const apiUrl = 'https://data.winnipeg.ca/resource/fgza-8s5e.json?' +
                `$where=lower(type) LIKE lower('%${textField}%')` +
                '&$order=date DESC' +
                `&$limit=100`;

	fetch(encodeURI(apiUrl))
	    .then(function(result) {
	    	return result.json();
	    })
	    .then(function(data) {
	    	createTable(data);
	    });	
}

// Create the final table.
function createTable(data) {
	let tableSelector = document.querySelector("tbody");
	tableSelector.innerHTML = "";

	// Display or hide the message letting the user know that nothing was found.
	// Display or hide the total number of records
	// Make the table is visible or hidden.
	if (data.length == 0) {
		document.getElementById("message").style.visibility = "visible";
		document.getElementById("records").style.visibility = "hidden";
		for (let i=0; i<6; i++) {
				document.getElementsByClassName("th")[i].style.visibility = "hidden";
			}
	}	else {
			document.getElementById("message").style.visibility = "hidden";
			let totalRecords = document.getElementById("records");
			totalRecords.innerHTML = `Total number of records: ${data.length}`;
			document.getElementById("records").style.visibility = "visible";
			for (let i=0; i<6; i++) {
				document.getElementsByClassName("th")[i].style.visibility = "visible";
			}		
	}

	for (let i=0; i<data.length; i++) {
		let tr = document.createElement("tr");
		tableSelector.appendChild(tr);

		let dateTd = document.createElement("td");
		dateTd.innerHTML = data[i].date.substring(0, 10);
		tr.appendChild(dateTd);

		let amountTd = document.createElement("td");
		let newFormat = new Intl.NumberFormat('en-US');
		amountTd.innerHTML = newFormat.format(data[i].amount);
		tr.appendChild(amountTd);

		let typeTd = document.createElement("td");
		typeTd.innerHTML = data[i].type;
		tr.appendChild(typeTd);

		let yearTd = document.createElement("td");
		yearTd.innerHTML = data[i].year;
		tr.appendChild(yearTd);

		let quarterTd = document.createElement("td");
		quarterTd.innerHTML = data[i].quarter;
		tr.appendChild(quarterTd);

		let yard_waste_typeTd = document.createElement("td");
		if (!data[i].yard_waste_type) {
			yard_waste_typeTd.innerHTML = "";
		}	else {
			yard_waste_typeTd.innerHTML = data[i].yard_waste_type;
		}
		tr.appendChild(yard_waste_typeTd);
	}
}