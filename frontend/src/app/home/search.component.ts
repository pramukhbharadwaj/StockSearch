import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ApplicationConstants} from "../constants/application-constants";
import {LocalStorageService} from "../service/local-storage.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  options: any;
  isLoading = false;
  searchField;
  searchForm;
  ticker;
  noDataFound = false;
  invalidInputField = false;

  constructor(private activatedRoute: ActivatedRoute, private router:Router, private apiService: ApiService, private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      if(params['ticker'])
        this.localStorageService.storeToLocalStorage(ApplicationConstants.STATE_SERVICE_CATEGORY_LOCAL_STORAGE, ApplicationConstants.RECENT_PAGE, params['ticker']);
      else
        this.localStorageService.storeToLocalStorage(ApplicationConstants.STATE_SERVICE_CATEGORY_LOCAL_STORAGE, ApplicationConstants.RECENT_PAGE, 'home');
      this.invalidInputField = false;
      this.noDataFound = false;
      this.ticker = params['ticker'] != 'home'? params['ticker']: undefined;
    });

    this.searchForm = new FormGroup({
      searchField: new FormControl()
    });

    this.searchForm.get('searchField').valueChanges
      .pipe(
        debounceTime(200),
        tap(() => {
          this.options = [];
          this.isLoading = true;
        }),
        switchMap(value => this.apiService.getAutoCompleteSearchResults(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        this.options = this.filterAutoCompleteData(data);
        console.log(this.options);
      });
  }

  onSubmit(data: any): void {
    if(data)
    {
      let searchData = data.trim().toUpperCase();
      const observable = this.apiService.getSearchResults(searchData);
      observable.subscribe(result => this.routeToSpecificTickerPage(result, searchData));
    }
    else
    {
      this.displayInvalidTickerMessage();
    }
  }

  filterAutoCompleteData(data): any {
    const result = []; let index = 0;
    for (let i = 0; i < data.result.length; i++) {
      if (data.result[i].type === 'Common Stock' && !data.result[i].symbol.includes('.')) {
        result[index++] = data.result[i].symbol + " | " +data.result[i].description;
      }
    }
    return result;
  }

  routeToSpecificTickerPage(result, searchField): void {
    if(Object.keys(result).length){
      this.invalidInputField = false;
      this.ticker = searchField;
      this.localStorageService.storeToLocalStorage(ApplicationConstants.STATE_SERVICE_CATEGORY_LOCAL_STORAGE, ApplicationConstants.RECENT_PAGE, this.ticker);
      this.router.navigate(['/search/'+this.ticker]);
    }
    else
    {
      this.ticker = undefined;
      this.displayNoDataFoundErrorMessage();
    }
  }

  clearSearchResult(): void {
    this.noDataFound = false;
    this.invalidInputField = false;
    this.ticker = false;
    this.searchForm.get('searchField').reset();
    this.localStorageService.storeToLocalStorage(ApplicationConstants.STATE_SERVICE_CATEGORY_LOCAL_STORAGE, ApplicationConstants.RECENT_PAGE, 'home');
    this.router.navigate(['/search/home']);
  }

  displayNoDataFoundErrorMessage()
  {
    this.noDataFound = true;
    this.invalidInputField = false;
  }

  displayInvalidTickerMessage()
  {
    this.ticker = undefined;
    this.noDataFound = false;
    this.invalidInputField = true;
  }

  clearInvalidTickerMessage()
  {
    this.invalidInputField = false;
  }
}
