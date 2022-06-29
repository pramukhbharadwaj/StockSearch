import {Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewChecked} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import indicator from 'highcharts/indicators/indicators-all';
indicator(Highcharts);
import NoData  from 'highcharts/modules/no-data-to-display';

NoData(Highcharts)

@Component({
  selector: 'app-tab-charts',
  templateUrl: './tab-charts.component.html',
  styleUrls: ['./tab-charts.component.css']
})
export class TabChartsComponent implements OnInit, OnChanges, AfterViewChecked {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  updateFlag: boolean = false;
  chartInitializedOnChange = false;
  @Input() historicalPriceResults;
  @Input() ticker;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.chartInitializedOnChange)
    {
      this.updateFlag = true;
      this.initialize();
      this.chartInitializedOnChange = true;
    }
  }

  ngAfterViewChecked() {
    window.dispatchEvent(new Event('resize'));
  }

  private initialize() {
    let ohlc = [],
      volume = [],
      dataLength = this.historicalPriceResults.c.length,

      i = 0;

    for (i; i < dataLength; i += 1) {
      ohlc.push([
        this.historicalPriceResults.t[i] * 1000, // the date
        this.historicalPriceResults.o[i], // open
        this.historicalPriceResults.h[i], // high
        this.historicalPriceResults.l[i], // low
        this.historicalPriceResults.c[i] // close
      ]);

      volume.push([
        this.historicalPriceResults.t[i] * 1000, // the date
        this.historicalPriceResults.v[i] // the volume
      ]);
    }

    this.chartOptions = {
      rangeSelector: {
        enabled: true,
        inputEnabled: true,
        selected: 2
      },

      title: {
        text: this.ticker + ' Historical'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      xAxis: {
        type: 'datetime',
        scrollbar: {
          enabled: true
        }
      },
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        opposite: true,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        opposite: true,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },
      lang: {
        noData: "No data to display"
      },
      // plotOptions: {
      //   series: {
      //     dataGrouping: {
      //       units: [[
      //         'day',                         // unit name
      //         [1]                             // allowed multiples
      //       ], [
      //         'month',
      //         [1, 2, 3, 4, 6]
      //       ]]
      //     }
      //   }
      // },

      series: [{
        type: 'candlestick',
        name: this.ticker,
        id: this.ticker,
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: this.ticker,
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: this.ticker,
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    };
  }
}
