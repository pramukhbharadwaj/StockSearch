import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../service/local-storage.service";
import {ApplicationConstants} from "../constants/application-constants";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  successStyling: string = "margin-top: 20px;margin-bottom: 20px;padding-top:6px;padding-bottom: 1px;background-color: #d2eddc";
  dangerStyling: string = "margin-top: 20px;margin-bottom: 20px;padding-top:6px;padding-bottom: 1px;background-color: #f9d7da";
  shouldDisplayPortfolioAlertMessage: boolean = false;
  portfolioAlertMessage: string;
  portfolioAlertMessageStyling: string;
  portfolioCards = new Map<string, any>();
  currentPriceMap = new Map<string, number>();
  moneyInWallet;
  portfolioAlertTimerVariable;

  constructor(private localStorageService: LocalStorageService, private apiService: ApiService) {
  }

  ngOnInit(): void {

    this.moneyInWallet = this.localStorageService.getFromLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT);
    this.portfolioCards = this.localStorageService.getAllKeyValuePairsFromLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE);
    this.portfolioCards.forEach((value: any, key: string) => {
        let quoteResultObservable = this.apiService.getQuoteResults(value.ticker);
      quoteResultObservable.subscribe((results) => {
        this.currentPriceMap.set(value.ticker, results.c);
      })
    });
  }

  refreshComponentHandler() {
    this.ngOnInit();
  }

  clearPortfolioMessage()
  {
    this.shouldDisplayPortfolioAlertMessage = false;
  }

  transactionComponentHandler(transaction: string, ticker: string)
  {
    if(transaction == "buy")
    {
      this.portfolioAlertMessageStyling = this.successStyling;
      this.portfolioAlertMessage = ticker + " bought successfully"
      this.refreshComponentHandler();
    }
    else if(transaction == "sell")
    {
      this.portfolioAlertMessageStyling = this.dangerStyling;
      this.portfolioAlertMessage = ticker + " sold successfully"
      this.refreshComponentHandler();
    }
    this.shouldDisplayPortfolioAlertMessage = true;
    clearTimeout(this.portfolioAlertTimerVariable);
    this.portfolioAlertTimerVariable = setTimeout(() => this.shouldDisplayPortfolioAlertMessage = false, 5000);
    this.ngOnInit();
  }
}
