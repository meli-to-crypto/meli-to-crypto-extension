export class JSDOM {
  getElementByClassName(elementName: string) {
    return document.getElementsByClassName(elementName);
  }

  getElementByQuerySelector(elementName: any) {
    return document.querySelector(elementName);
  }

  getElementByQuerySelectorAll(elementName: any) {
    return document.querySelectorAll(elementName);
  }

  removeElement(elementName: any) {
    const element = this.getElementByQuerySelectorAll(elementName);
    for (let i = 0; i < element.length; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
  }

  removeSymbolAndCents() {
    // Pesos symbol
    this.removeElement('.andes-money-amount__currency-symbol');
    // Small cents
    this.removeElement('.andes-money-amount__cents');
  }
}
