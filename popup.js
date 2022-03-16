// @ts-check
let pairCode = document.getElementById("pairCode");

function getDecimals(pairCode) {
	switch (pairCode) {
		case "USDT/ARS":
			return 2;
		case "BTC/ARS":
			return 5;
		case "ETH/ARS":
			return 4;
		default:
			return 2;
	}
}

pairCode.addEventListener("change", async (event) => {
	let pairCode = event.target.value;
	chrome.storage.sync.set({pairCode});
	let code = pairCode.split("/")[0];
	chrome.storage.sync.set({code});
	let decimals = getDecimals(pairCode);
	chrome.storage.sync.set({decimals});

	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		function: renderPage,
	});
});

async function renderPage() {
	// Parent sections of pricing information
	let pricingElementsSelector = '.andes-money-amount, .price-tag-amount, .item-price, .item-price--old';
	let pricingSubElementSymbols = '.andes-money-amount__currency-symbol, .price-tag-symbol, .price-symbol';
	let pricingSubElementFraction = '.andes-money-amount__fraction, .price-tag-fraction, .price-fraction';
	let pricingSubElementCents = '.andes-money-amount__cents, .price-tag-cents, .price-cents';
	
	async function retrieveRates() {
		const options = {
			method: 'GET',
			mode: 'cors',
			credentials: 'omit',
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer'
		};
		return await fetchURL('https://api.belo.app/public/price', options);
	}

	async function fetchURL(url = '', options = {}) {
		const response = await fetch(url, options);
		return response.json();
	}

	function retrieveCurrency(rates = [], pairCode) {
		return rates.filter((rate) => rate.pairCode === pairCode)[0];
	}

	function getElement(elementName) {
		return document.querySelectorAll(elementName);
	}

	function removeElement(elementName) {
		const element = getElement(elementName);
		for (let i = 0; i < element.length; i++) {
			element[i].parentNode.removeChild(element[i]);
		}
	}

	// Join MELI's amount v cents into standard format
	function preparePricingFloat(price, cents = '0') {
		return parseFloat( [ price.replace('.',''), cents ].join('.') );
	}

	function changePricing(elements, ask, code) {
		chrome.storage.sync.get("decimals", ({decimals}) => {
			for (let i = 0; i < elements.length; i++) {
				let price_symbol = elements[i].querySelector(pricingSubElementSymbols);
				let price_fraction = elements[i].querySelector(pricingSubElementFraction);
				let price_cents = elements[i].querySelector(pricingSubElementCents);
				
				// Store original ARS pricing information on each pricing element
				if ( price_symbol.getAttribute('m2c-original') == null ) {
					elements[i].setAttribute('m2c-original', 'stored');
					price_symbol.setAttribute('m2c-original', price_symbol.innerHTML);
					price_fraction.setAttribute('m2c-original', preparePricingFloat(price_fraction.innerHTML, price_cents?.innerHTML || "0"));
				}

				price_symbol.innerHTML = code;
				price_fraction.innerHTML = convertPrice( price_fraction.getAttribute('m2c-original'), ask, decimals);
				price_cents ? price_cents.innerHTML = '' : null;
			}
		});
	}
	
	function convertPrice(originCoin, newCoin, decimals) {
		return `${(originCoin/newCoin).toFixed(decimals)}`;
	}
	
	// Main function
	const rates = await retrieveRates();
	
	chrome.storage.sync.get("pairCode", ({pairCode}) => {
		const {ask} = retrieveCurrency(rates, pairCode);
		const pricingElements = getElement(pricingElementsSelector);

		chrome.storage.sync.get("code", ({code}) => {
			changePricing( pricingElements, ask, code );
		});
	});

}