import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SearchComponent} from './home/search.component';
import {WatchlistComponent} from './watchlist/watchlist.component';
import {PortfolioComponent} from "./portfolio/portfolio.component";

const routes: Routes = [{ path: '', redirectTo: '/search/home', pathMatch: 'full'},
  { path: 'search', redirectTo: '/search/home', pathMatch: 'full'},
  { path: 'search/:ticker', component: SearchComponent, data: {shouldReuse: true}},
  { path: 'watchlist', component: WatchlistComponent},
  { path: 'portfolio', component: PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
