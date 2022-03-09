function dolarizar() {
    // remove element of class andes-money-amount__currency-symbol (signo pesos)
    (document.querySelectorAll('.andes-money-amount__currency-symbol') ?? []).forEach(el => el.remove());
    // fetch rate from 'https://api.belo.app/public/rate' and use it to calculate usdt price
    fetch('https://api.belo.app/public/price').then(resp => resp.json()).then(response=>{
        const rate = response[3].ask;
        console.log(rate)
        // find all elements of class andes-money-amount__fraction
        // Procesar todos los precios y marcarlos en rojo en la pagina
        document.querySelectorAll('.andes-money-amount__fraction').forEach(element=>{
            element.style.color = 'red';
            element.innerHTML = ((element.innerHTML.replace(".", "")) / rate).toFixed(2) + " USDT";
        })

        // remove element of class andes-money-amount__cents andes-money-amount__cents--superscript-18 (centavos)
        (document.querySelectorAll('.andes-money-amount__cents') ?? []).forEach(el=>el.remove());
    });
}

// Init Chrome extension
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: dolarizar
  });
});
