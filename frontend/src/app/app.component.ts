import { Component } from '@angular/core';
import {LocalStorageService} from "./service/local-storage.service";
import {ApplicationConstants} from "./constants/application-constants";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = true;
  title = 'Stock Search';

  constructor(private localStorageService : LocalStorageService, private titleService: Title) {
    this.initializeDefaultWallet();
    this.titleService.setTitle(this.title);
  }

  private initializeDefaultWallet() {
    if(!this.localStorageService.getFromLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT))
      this.localStorageService.storeToLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT, 25000)
  }

  getRecentTicker() {
    return this.localStorageService.getFromLocalStorage(ApplicationConstants.STATE_SERVICE_CATEGORY_LOCAL_STORAGE, ApplicationConstants.RECENT_PAGE)
  }
}
