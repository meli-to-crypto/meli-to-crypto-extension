export class ChromeExtension {
  getStorage(key: any) {
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.get([key], (items) => {
        if (!items) reject('no items');
        resolve(items);
      });
    }) as any;
  }

  setStorage(key: any, value: any) {
    return new Promise((resolve, reject) => {
      return chrome.storage.sync.set({ [key]: value }, () => {
        if (!key) reject('no key');
        if (!value) reject('no value');
        resolve('saved succesfuly');
      });
    });
  }
}
