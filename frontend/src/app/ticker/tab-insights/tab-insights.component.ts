import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import NoData  from 'highcharts/modules/no-data-to-display';

NoData(Highcharts)

@Component({
  selector: 'app-tab-insights',
  templateUrl: './tab-insights.component.html',
  styleUrls: ['./tab-insights.component.css']
})
export class TabInsightsComponent implements OnInit, OnChanges {
  initialized = false;
  @Input() basicSearchResults;
  @Input() sentimentResults;
  @Input() recommendationResults;
  @Input() companyEarningResults;

  companyName: string
  totalMentionsReddit: number = 0;
  totalMentionsTwitter: number = 0;
  positiveMentionsReddit: number = 0;
  positiveMentionsTwitter: number = 0;
  negativeMentionsReddit: number = 0;
  negativeMentionsTwitter: number = 0;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsForRecommendationTrends: Highcharts.Options;
  chartOptionsForHistoricalEPS: Highcharts.Options;
  updateFlag = false;

  constructor() {
  }

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
    this.companyName = this.basicSearchResults.name;

    for (let i = 0; i < this.sentimentResults.reddit.length; i++) {
      this.totalMentionsReddit += this.sentimentResults.reddit[i].mention;
      this.positiveMentionsReddit += this.sentimentResults.reddit[i].positiveMention;
      this.negativeMentionsReddit += this.sentimentResults.reddit[i].negativeMention;
    }

    for (let i = 0; i < this.sentimentResults.twitter.length; i++) {
      this.totalMentionsTwitter += this.sentimentResults.twitter[i].mention;
      this.positiveMentionsTwitter += this.sentimentResults.twitter[i].positiveMention;
      this.negativeMentionsTwitter += this.sentimentResults.twitter[i].negativeMention;
    }

    this.setChartOptionsForRecommendationTrends();

    this.setChartOptionsForHistoricalEPS();
  }

  private setChartOptionsForRecommendationTrends() {
    let recommendationCategories = [];
    let strongBuy = [];
    let buy = [];
    let hold = [];
    let sell = [];
    let strongSell = [];

    for (let i = 0; i < this.recommendationResults.length; i++) {
      recommendationCategories.push(this.recommendationResults[i].period);
      strongBuy.push(this.recommendationResults[i].strongBuy);
      buy.push(this.recommendationResults[i].buy);
      hold.push(this.recommendationResults[i].hold);
      sell.push(this.recommendationResults[i].sell);
      strongSell.push(this.recommendationResults[i].strongSell);
    }

    this.chartOptionsForRecommendationTrends = {
      colors: ['#427E4E', '#66BF73', '#C19C46', "#EB7C74", '#8C4843'],
      chart: {
        type: 'column'
      },
      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: recommendationCategories
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      lang: {
        noData: "No data to display"
      },
      series: [{
        name: 'Strong Buy',
        data: strongBuy,
        type: 'column'
      }, {
        name: 'Buy',
        data: buy,
        type: 'column'
      }, {
        name: 'Hold',
        data: hold,
        type: 'column'
      }, {
        name: 'Sell',
        data: sell,
        type: 'column'
      }, {
        name: 'Strong Sell',
        data: strongSell,
        type: 'column'
      }]
    };
  }

  private setChartOptionsForHistoricalEPS() {
    let epsCategories = [];
    let actualList = [];
    let estimateList = [];

    for (let i = 0; i < this.companyEarningResults.length; i++) {
      let surprise = this.companyEarningResults[i].surprise == null ? 0 : this.companyEarningResults[i].surprise;
      epsCategories.push(this.companyEarningResults[i].period + '<br>' + 'Surprise ' + surprise);
      actualList.push(this.companyEarningResults[i].actual == null ? 0 : this.companyEarningResults[i].actual);
      estimateList.push(this.companyEarningResults[i].estimate == null ? 0 : this.companyEarningResults[i].estimate)
    }

    this.chartOptionsForHistoricalEPS = {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      lang: {
        noData: "No data to display"
      },
      xAxis: {
        reversed: false,
        maxPadding: 0.05,
        showLastLabel: true,
        categories: epsCategories
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        },
        lineWidth: 2
      },
      tooltip: {
        shared: true
      },
      series: [{
        name: 'Actual',
        data: actualList,
        type: 'spline'
      },
        {
          name: 'Estimate',
          data: estimateList,
          type: 'spline'
        }
      ]
    };
  }
}
