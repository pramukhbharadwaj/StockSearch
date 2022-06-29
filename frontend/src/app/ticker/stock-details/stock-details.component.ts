import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LocalStorageService} from "../../service/local-storage.service";
import {ApplicationConstants} from "../../constants/application-constants";
import {LocalStorageAlertService} from "../../service/local-storage-alert.service";


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit, OnChanges {
  successStyling: string = "margin-top: 20px;margin-bottom: 20px;padding-top:6px;padding-bottom: 1px;background-color: #d2eddc";
  dangerStyling: string = "margin-top: 20px;margin-bottom: 20px;padding-top:6px;padding-bottom: 1px;background-color: #f9d7da";
  @Input() basicSearchResults;
  @Input() quoteResults;
  ticker: string;
  companyName: string;
  exchangeCode: string;
  lastPrice: number;
  change: number;
  changePercentage: number;
  lastStockDetailsAvailableTimeStamp: number;
  currentDateTimeInISO: string;
  closeTimeInISO: string;
  marketStatus: string;
  shouldDisplayWatchlistAlertMessage: boolean = false;
  shouldDisplayPortfolioAlertMessage: boolean = false;
  watchlistAlertMessage: string;
  portfolioAlertMessage: string;
  starButton_styling: string;
  ifStockPurchased: boolean;
  companyLogoLink: string;
  profit_loss_styling: string;
  market_status_styling: string;
  watchlistAlertMessageStyling: string;
  portfolioAlertMessageStyling: string;
  watchlistAlertTimerVariable;
  portfolioAlertTimerVariable;

  constructor(private localStorageService : LocalStorageService, private localStorageAlertService : LocalStorageAlertService) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initialize();

  }

  private initialize() {
    this.ticker = this.basicSearchResults.ticker;

    this.localStorageAlertService.itemValue.subscribe((nextValue) => {
      this.starButton_styling = this.localStorageService.isSymbolPresentInLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE, this.ticker) ? "bi bi-star-fill" : "bi bi-star";
      this.ifStockPurchased = this.localStorageService.isSymbolPresentInLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.ticker);
    });

    this.companyName = this.basicSearchResults.name;
    this.exchangeCode = this.basicSearchResults.exchange;
    this.lastPrice = this.quoteResults.c;
    this.change = this.quoteResults.d;
    this.changePercentage = this.quoteResults.dp;
    if(this.change<0)
    {
      this.profit_loss_styling = "loss_styling";
    }
    else
    {
      this.profit_loss_styling = "profit_styling";
    }
    this.lastStockDetailsAvailableTimeStamp = this.quoteResults.t;
    this.currentDateTimeInISO = new Date().toISOString().substr(0, 10) + " " + new Date(Date.now() - 25200000).toISOString().substr(11, 8);
    this.closeTimeInISO = new Date(this.lastStockDetailsAvailableTimeStamp * 1000 - 25200000).toISOString().substr(0, 10) + " " + new Date(this.lastStockDetailsAvailableTimeStamp * 1000 - 25200000).toISOString().substr(11, 8);
    const currentTimeStamp = (new Date().getTime()) / 1000;
    this.marketStatus = currentTimeStamp - this.lastStockDetailsAvailableTimeStamp > 300 ? "closed on" : "open";
    if(this.marketStatus == "open")
      this.market_status_styling = "market_open_styling";
    else
      this.market_status_styling = "market_closed_styling";

    this.companyLogoLink = this.basicSearchResults.logo;

    //star button
    this.starButton_styling = this.localStorageService.isSymbolPresentInLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE, this.ticker) ? "bi bi-star-fill" : "bi bi-star";

    this.ifStockPurchased = this.localStorageService.isSymbolPresentInLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.ticker);
  }

  watchListClick(): void {
    this.handleWatchListClick();
  }

  private handleWatchListClick() {
    if(this.localStorageService.isSymbolPresentInLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE, this.ticker))
    {
      this.deleteFromLocalStorage();
      this.starButton_styling = "bi bi-star";
      this.watchlistAlertMessageStyling = this.dangerStyling;
      this.watchlistAlertMessage = this.ticker + " removed from the watchlist";
    }
    else
    {
      this.storeToLocalStorage();
      this.starButton_styling = "bi bi-star-fill";
      this.watchlistAlertMessageStyling = this.successStyling;
      this.watchlistAlertMessage = this.ticker + " added to the watchlist";
    }
    this.shouldDisplayWatchlistAlertMessage = true;
    clearTimeout(this.watchlistAlertTimerVariable);
    this.watchlistAlertTimerVariable = setTimeout(() => this.shouldDisplayWatchlistAlertMessage = false, 5000);
  }

  private storeToLocalStorage() {
    let watchList_metaData = {
      ticker: this.ticker,
      companyName: this.companyName,
      lastPrice: this.lastPrice,
      change: this.change,
      changePercentage: this.changePercentage
    };


    this.localStorageService.storeToLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE, this.ticker, watchList_metaData);
  }

  private deleteFromLocalStorage() {
    this.localStorageService.deleteFromLocalStorage(ApplicationConstants.WATCHLIST_CATEGORY_LOCAL_STORAGE, this.ticker);
  }

  refreshComponentHandler()
  {
    this.ngOnInit();
  }

  clearWatchListMessage()
  {
    this.shouldDisplayWatchlistAlertMessage = false;
  }

  clearPortfolioMessage()
  {
    this.shouldDisplayPortfolioAlertMessage = false;
  }

  transactionComponentHandler(transaction: string)
  {
    if(transaction == "buy")
    {
      this.portfolioAlertMessageStyling = this.successStyling;
      this.portfolioAlertMessage = this.ticker + " bought successfully"
      this.refreshComponentHandler();
    }
    else if(transaction == "sell")
    {
      this.portfolioAlertMessageStyling = this.dangerStyling;
      this.portfolioAlertMessage = this.ticker + " sold successfully"
      this.refreshComponentHandler();
    }
    this.shouldDisplayPortfolioAlertMessage = true;
    clearTimeout(this.portfolioAlertTimerVariable);
    this.portfolioAlertTimerVariable = setTimeout(() => this.shouldDisplayPortfolioAlertMessage = false, 5000);
  }
}
