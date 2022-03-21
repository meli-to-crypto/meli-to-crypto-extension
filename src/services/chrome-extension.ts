export class ChromeExtension {
  async getStorage(key: any) {
    return await chrome.storage.sync.get([key], (items) => {
      console.log(
        '🚀 => ChromeExtension => returnawaitchrome.storage.sync.get => items',
        items
      );
      return items;
    });
  }

  async setStorage(key: any, value: any) {
    return await chrome.storage.sync.set({ [key]: value }, () => {
      console.log('saved data');
    });
  }
}
