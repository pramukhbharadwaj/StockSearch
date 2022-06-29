import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from "../../service/local-storage.service";
import {ApplicationConstants} from "../../constants/application-constants";

@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css']
})
export class BuyModalComponent implements OnInit {
  moneyInWallet;
  quantity;
  @Input() isBuyButtonSuccess = false;
  @Input() companyName;
  @Input() modalTitle;
  @Input() currentPriceOfStock;
  @Output() actionHappened: EventEmitter<number> = new EventEmitter()

  constructor(private localStorageService: LocalStorageService, private modalService: NgbModal) { }

  ngOnInit(): void {

  }

  open(content) {
    this.quantity = 0;
    this.moneyInWallet = this.localStorageService.getFromLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((quantity) => {
        let existingStockDetails = this.localStorageService.getFromLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.modalTitle);
        let existingQuantity;
        let totalCost;

        if(!existingStockDetails)
        {
          existingQuantity = 0;
          totalCost = 0;
        }
        else
        {
          existingQuantity = existingStockDetails.quantity;
          totalCost = existingStockDetails.totalCost;
        }

        this.localStorageService.storeToLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.modalTitle, {ticker: this.modalTitle, companyName: this.companyName, quantity: parseInt(existingQuantity) + parseInt(quantity), totalCost: (parseInt(totalCost) + parseInt(quantity)*this.currentPriceOfStock)});

        this.localStorageService.storeToLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT, this.moneyInWallet - quantity*this.currentPriceOfStock);
        this.actionHappened.emit();
    });
  }
}
