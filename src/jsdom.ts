export class JSDOM {
  getElementByClassName(elementName: string) {
    return document.getElementsByClassName(elementName);
  }

  getElementByQuerySelector(elementName: any) {
    return document.querySelectorAll(elementName);
  }

  removeElement(elementName: any) {
    const element = this.getElementByQuerySelector(elementName);
    for (let i = 0; i < element.length; i++) {
      element[i].parentNode.removeChild(element[i]);
    }
  }
}
