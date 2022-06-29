import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  storeToLocalStorage(category, key, value) {
    localStorage.setItem(category + "_" + key, JSON.stringify(value));
  }

  deleteFromLocalStorage(category, key) {
    localStorage.removeItem(category + "_" + key);
  }

  deleteFromLocalStorageSingleParameter(categoryPlusKey) {
    localStorage.removeItem(categoryPlusKey);
  }

  getFromLocalStorage(category, key) {
    return JSON.parse(localStorage.getItem(category + "_" + key));
  }

  isSymbolPresentInLocalStorage(category, key) {
    let map = new Map<string, string>();
    for (let i = 0; i < localStorage.length; i++) {
      map.set(localStorage.key(i), JSON.parse(localStorage.getItem(localStorage.key(i))));
    }

    return map.has(category + "_" + key);
  }

  getAllKeyValuePairsFromLocalStorage(category) {
    let map = new Map<string, any>();
    for (let i = 0; i < localStorage.length; i++) {
      if(localStorage.key(i).startsWith(category))
        map.set(localStorage.key(i), JSON.parse(localStorage.getItem(localStorage.key(i))));
    }
    return map;
  }
}
