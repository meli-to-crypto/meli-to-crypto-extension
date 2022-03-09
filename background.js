function dolarizar() { // remove element of class andes-money-amount__currency-symbol (signo pesos)
    var elements = document.getElementsByClassName('andes-money-amount__currency-symbol');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
    }
    // fetch rate from 'https://api.belo.app/public/rate' and use it to calculate usdt price
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.belo.app/public/price', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // si el api responde bien guardar cotizacion en variable rate.
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var rate = response[3].ask;
                console.log(rate)
                // find all elements of class andes-money-amount__fraction
                var elements = document.getElementsByClassName('andes-money-amount__fraction');
                // Procesar todos los precios y marcarlos en rojo en la pagina
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.color = 'red';
                    // get the value of the element
                    elements[i].innerHTML = ((elements[i].innerHTML.replace(".", "")) / rate).toFixed(2) + " USDT";
                }
                // remove element of class andes-money-amount__cents andes-money-amount__cents--superscript-18 (centavos)
                var cents = document.getElementsByClassName('andes-money-amount__cents');
                for (var i = 0; i < cents.length; i++) {
                    cents[i].parentNode.removeChild(cents[i]);
                }
            }
        }
    };
    xhr.send();

}


chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: dolarizar
    });
});
