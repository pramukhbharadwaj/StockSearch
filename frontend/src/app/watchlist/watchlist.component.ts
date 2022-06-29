import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from "../service/local-storage.service";
import {Router} from "@angular/router";
import {ApplicationConstants} from "../constants/application-constants";
import {LocalStorageAlertService} from "../service/local-storage-alert.service";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  wishlistCardsMap = new Map<string, any>();

  constructor(private router: Router, private localStorageService : LocalStorageService, private localStorageAlertService: LocalStorageAlertService) { }

  ngOnInit(): void {
    this.renderDataFromLocalStorage()
  }

  private renderDataFromLocalStorage() {
    this.wishlistCardsMap = this.localStorageService.getAllKeyValuePairsFromLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE);
  }

  private onCloseButtonClick(event) {
    let target = event.currentTarget;
    let idAttr = target.attributes.id.nodeValue;
    this.wishlistCardsMap.delete(idAttr);
    this.localStorageService.deleteFromLocalStorageSingleParameter(idAttr);
    this.localStorageAlertService.theItem = 'someValue';
  }
}
