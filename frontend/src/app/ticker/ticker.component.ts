import {Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {ApiService} from '../service/api.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit, OnChanges {
  initialized=false;
  @Input() ticker: string;
  basicSearchResults: any;
  quoteResults: any;
  companyPeerResults: any;
  newsResults: any;
  historicalPriceResults: any;
  sentimentResults: any;
  recommendationResults: any;
  companyEarningResults: any;
  timerVariable;

  dontDestroyChart = true;
  isMarketOpen = true;
  shouldShowContent = true;

  constructor(private apiService: ApiService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initialized = true;
    this.getTickerDetailsForDisplay();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.initialized){
      this.dontDestroyChart = false;
      this.changeDetector.detectChanges();
      this.dontDestroyChart = true;
      this.shouldShowContent = true;
      this.getTickerDetailsForDisplay();
      if(this.isMarketOpen)
      {
        this.refreshEveryFifteenSeconds();
      }
    }
  }

  refreshEveryFifteenSeconds() {
    clearTimeout(this.timerVariable);
    this.timerVariable = setInterval(() => this.getTickerDetailsForDisplay(), 15000);
  }

  getTickerDetailsForDisplay() {
    if(this.ticker)
    {
      this.uninitialize();

      let basicSearchResultsObservable = this.apiService.getSearchResults(this.ticker);
      let quoteResultsObservable = this.apiService.getQuoteResults(this.ticker);
      let companyPeerResultsObservable = this.apiService.getCompanyPeersResults(this.ticker);
      let newsResultsObservable = this.apiService.getCompanyNewsResults(this.ticker);
      let historicalPriceResultsForPastTwoYearsObservable = this.apiService.getHistoricalDataResults(this.ticker, Math.trunc(new Date(new Date().setFullYear(new Date().getFullYear() - 2)).getTime()/1000), Math.trunc(new Date().getTime()/1000), 'D');
      let sentimentResultsObservable = this.apiService.getSentimentResults(this.ticker);
      let recommendationResultsObservable = this.apiService.getRecommendationTrendsResults(this.ticker);
      let companyEarningResultsObservable = this.apiService.getCompanyEarningsResults(this.ticker);

      basicSearchResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else
        {
          this.basicSearchResults = results;
        }
      });

      quoteResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.quoteResults = results;
          //make this change and push
          this.isMarketOpen = ((new Date().getTime()) / 1000 - this.quoteResults.t) > 300 ? false : true;
        }
      });

      companyPeerResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.companyPeerResults = results;
        }
      });

      newsResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.newsResults = results;
        }
      });

      historicalPriceResultsForPastTwoYearsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.historicalPriceResults = results;
        }
      });

      sentimentResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.sentimentResults = results;
        }
      });

      recommendationResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.recommendationResults = results;
        }
      });

      companyEarningResultsObservable.subscribe(results => {
        if(results.error)
        {
          this.shouldShowContent = false;
        }
        else {
          this.companyEarningResults = results;
        }
      });
    }

  }

  private uninitialize() {
    this.basicSearchResults = undefined;
    this.quoteResults = undefined;
    this.companyPeerResults = undefined;
    this.newsResults = undefined;
    this.historicalPriceResults = undefined;
    this.sentimentResults = undefined;
    this.recommendationResults = undefined;
    this.companyEarningResults = undefined;
  }
}
