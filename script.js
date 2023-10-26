// Include API for currency change
const api = "https://v6.exchangerate-api.com/v6/4e3d1f63d8b1250d0d354eb5/latest/USD";

// Select different controls
let search = document.querySelector(".searchBox");
let convert = document.querySelector(".convert");
let fromCurrency = document.querySelector(".from");
let toCurrency = document.querySelector(".to");
let finalValue = document.querySelector(".finalValue");
let finalAmount = document.getElementById("finalAmount");
let resultFrom;
let resultTo;
let searchValue;

// Event when currency is changed
fromCurrency.addEventListener('change', (event) => {
	resultFrom = event.target.value;
});

// Event when currency is changed
toCurrency.addEventListener('change', (event) => {
	resultTo = event.target.value;
});

search.addEventListener('input', updateValue);

// Function for updating value
function updateValue(e) {
	searchValue = e.target.value;
}

// When user clicks, it calls function getResults 
convert.addEventListener("click", getResults);

// Function getResults
function getResults() {
	fetch(api)
		.then(response => response.json())
		.then(data => {
			const fromRate = data.conversion_rates[resultFrom];
			const toRate = data.conversion_rates[resultTo];
			const convertedAmount = (searchValue / fromRate) * toRate;
			finalValue.innerHTML = convertedAmount.toFixed(2);
			finalAmount.style.display = "block";
		})
		.catch(error => {
			console.error("Error fetching currency data:", error);
		});
}

// When the user clicks the reset button
function clearVal() {
	search.value = "";
	finalValue.innerHTML = "";
	finalAmount.style.display = "none";
}
