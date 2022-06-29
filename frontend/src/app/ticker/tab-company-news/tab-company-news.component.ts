import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NewsModalComponent} from "../../modal/news-modal/news-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-tab-company-news',
  templateUrl: './tab-company-news.component.html',
  styleUrls: ['./tab-company-news.component.css']
})
export class TabCompanyNewsComponent implements OnInit, OnChanges {
  initialized = false;
  @Input() newsResults;
  effectiveNewsFeed = [];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initialized = true;
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.initialized)
    {
      this.effectiveNewsFeed = [];
      this.initialize();
    }
  }

  openNewsModal(feed) {
    const modalRef = this.modalService.open(NewsModalComponent, { keyboard: true });
    modalRef.componentInstance.news = feed;
    modalRef.result.then((result) => {
      console.log("result " + result);
    }, (reason) => {
      console.log("reason " + reason);
    });
  }

  private initialize() {
    for (let i = 0; i < this.newsResults.length; i++) {
      if (this.newsResults[i].image && this.newsResults[i].headline && this.newsResults[i].datetime && this.newsResults[i].url) {
        this.effectiveNewsFeed.push(this.newsResults[i])
        if (this.effectiveNewsFeed.length == 20)
          break;
      }
    }
  }
}
