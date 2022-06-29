import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from "../../service/api.service";
import * as Highcharts from 'highcharts';
import NoData  from 'highcharts/modules/no-data-to-display';

NoData(Highcharts)

@Component({
  selector: 'app-tab-stock-summary',
  templateUrl: './tab-stock-summary.component.html',
  styleUrls: ['./tab-stock-summary.component.css']
})

export class TabStockSummaryComponent implements OnInit, OnChanges {
  initialized = false;
  @Input() basicSearchResults;
  @Input() quoteResults;
  @Input() companyPeerResults;
  @Input() ticker;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
  marketStatus: string;
  change: number;
  lastStockDetailsAvailableTimeStamp: number;

  ipoStartDate: string;
  industry: string;
  website: string;
  companyPeers: string[];
  updateFlag: boolean = false;

  constructor( private apiService: ApiService) { }

  ngOnInit(): void {
    this.initialized = true;
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.initialized)
    {
      this.updateFlag = true;
      this.initialize();
    }
  }

  private initialize() {
    this.highPrice = this.quoteResults.h;
    this.lowPrice = this.quoteResults.l;
    this.openPrice = this.quoteResults.o;
    this.previousClosePrice = this.quoteResults.pc;
    this.ipoStartDate = this.basicSearchResults.ipo;
    this.industry = this.basicSearchResults.finnhubIndustry;
    this.website = this.basicSearchResults.weburl;
    this.companyPeers = this.companyPeerResults.filter(Boolean).filter(n => !n.includes("."));
    this.change = this.quoteResults.d.toFixed(2);
    this.lastStockDetailsAvailableTimeStamp = this.quoteResults.t;
    const currentTimeStamp = (new Date().getTime()) / 1000;
    this.marketStatus = currentTimeStamp - this.lastStockDetailsAvailableTimeStamp > 300 ? "closed" : "open";

    const toTime = this.marketStatus == 'open' ? Math.trunc(new Date().getTime() / 1000) : this.lastStockDetailsAvailableTimeStamp;
    const fromTime = toTime - 21600;
    let companyHistoricalResults = this.apiService.getHistoricalDataResults(this.ticker, fromTime, toTime, '5');
    let lineColor = this.change < 0 ? "#FF0000" : "#008000";
    companyHistoricalResults.subscribe(chartResults => {
      this.setChartOptions(chartResults, lineColor);
    })
  }

  setChartOptions(chartResults, lineColor): void {
    let mappingData = [],
    dataLength = chartResults.c.length,

    i = 0;

    for (i; i < dataLength; i += 1) {
      mappingData.push([
        chartResults.t[i] * 1000 - 25200000, // the date
        chartResults.c[i] // close
      ]);
    }

    this.chartOptions = {
      title: {
        text: this.ticker + " Hourly Price Variation"
      },
      xAxis: {
        crosshair: true,
        type: "datetime",
        title: {
          text: ''
        }
      },
      tooltip: {
        valueDecimals: 2,
        split: true
      },
      yAxis: {
        title: {
          text: ''
        },
        opposite: true
      },
      plotOptions: {
        series: {
          color: lineColor,
          marker: {  enabled: false }
        }
      },
      lang: {
        noData: "No data to display"
      },
      series: [{
        showInLegend: false,
        data: mappingData,
        type: 'line',
        name: this.ticker.toUpperCase()
      }]
    };
  }
}
