function reddenPage() {
  // remove element of class andes-money-amount__currency-symbol
  var elements = document.getElementsByClassName('andes-money-amount__currency-symbol');
  for (var i = 0; i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }
  // fetch value from 'https://api.belo.app/public/rate' and store it in variable
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.belo.app/public/price', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("hellos")
        var response = JSON.parse(xhr.responseText);
        var rate = response[3].ask;
        console.log(rate)
        // find all elements of class andes-money-amount__value
        var elements = document.getElementsByClassName('andes-money-amount__fraction');
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.color = 'red';
          // get the value of the element
          elements[i].innerHTML = ((elements[i].innerHTML.replace(".","")) / rate).toFixed(2) + " USDT";
        }
      }
    }
  };
  xhr.send();
}

/*
  var url = 'https://api.belo.app/public/rate';
  console.log("test2")
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    console.log("test1")
      if (this.status == 200) {
          var data = JSON.parse(this.response);
          console.log(data);
          let rate = data[4].rate;
          var priceTags = document.getElementsByClassName('andes-money-amount__fraction');
          for (var i = 0; i < priceTags.length; i++) {
              priceTags[i].style.color = 'red';
              priceTags[i].innerHTML = ((priceTags[i].innerHTML.replace(".","")) / rate).toFixed(2) + " USDT";
      
          }
      }}
  
    console.log("test")
  }*/
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    });
  });