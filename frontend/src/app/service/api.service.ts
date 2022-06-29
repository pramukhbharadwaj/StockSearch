import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getSearchResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/basicInfo', {params});
  }

  getAutoCompleteSearchResults(value): Observable<any> {
    const params = new HttpParams().set('probableTicker', value);
    return this.http.get(this.rootURL + '/autoComplete', {params});
  }

  getQuoteResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/quote', {params});
  }

  getHistoricalDataResults(value, from, to, resolution): Observable<any> {
    const params = new HttpParams().set('ticker', value).set('from', from).set('to', to).set('resolution', resolution);
    return this.http.get(this.rootURL + '/historicalData', {params});
  }

  getRecommendationTrendsResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/recommendationTrends', {params});
  }

  getCompanyNewsResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/companyNews', {params});
  }

  getSentimentResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/sentiment', {params});
  }

  getCompanyPeersResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/companyPeers', {params});
  }

  getCompanyEarningsResults(value): Observable<any> {
    const params = new HttpParams().set('ticker', value);
    return this.http.get(this.rootURL + '/companyEarnings', {params});
  }
}
