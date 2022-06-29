import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './home/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { TickerComponent } from './ticker/ticker.component';
import {MatTabsModule} from "@angular/material/tabs";
import { HighchartsChartModule } from 'highcharts-angular';
import { StockDetailsComponent } from './ticker/stock-details/stock-details.component';
import { TabStockSummaryComponent } from './ticker/tab-stock-summary/tab-stock-summary.component';
import { TabCompanyNewsComponent } from './ticker/tab-company-news/tab-company-news.component';
import { TabChartsComponent } from './ticker/tab-charts/tab-charts.component';
import { TabInsightsComponent } from './ticker/tab-insights/tab-insights.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { BuyModalComponent } from './modal/buy-modal/buy-modal.component';
import { SellModalComponent } from './modal/sell-modal/sell-modal.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AutoCompletePipe} from "./service/pipe/autocomplete.pipe";
import {FormatToTwoDecimalPlacePipe} from "./service/pipe/formatToTwoDecimalPlace.pipe";
import {NewsModalComponent} from "./modal/news-modal/news-modal.component";
import {RouteReuseStrategy} from "@angular/router";
import {CustomReuseStrategy} from "./CustomReuseStrategy";

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TickerComponent,
    StockDetailsComponent,
    TabStockSummaryComponent,
    TabCompanyNewsComponent,
    TabChartsComponent,
    TabInsightsComponent,
    WatchlistComponent,
    BuyModalComponent,
    SellModalComponent,
    PortfolioComponent,
    NewsModalComponent,
    AutoCompletePipe,
    FormatToTwoDecimalPlacePipe
  ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgbModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatAutocompleteModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        HighchartsChartModule,
        FormsModule,
        MatIconModule,
        MatButtonModule
    ],
  providers: [ {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
