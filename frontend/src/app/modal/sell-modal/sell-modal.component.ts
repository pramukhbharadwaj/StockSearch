import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "../../service/local-storage.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {ApplicationConstants} from "../../constants/application-constants";
import {LocalStorageAlertService} from "../../service/local-storage-alert.service";

@Component({
  selector: 'app-sell-modal',
  templateUrl: './sell-modal.component.html',
  styleUrls: ['./sell-modal.component.css']
})
export class SellModalComponent implements OnInit {
  quantity;
  moneyInWallet;
  currentQuantity: number;
  @Input() modalTitle;
  @Input() currentPriceOfStock;
  @Output() actionHappened: EventEmitter<number> = new EventEmitter()

  constructor(private localStorageService: LocalStorageService, private modalService: NgbModal, private localStorageAlertService: LocalStorageAlertService) {
  }

  ngOnInit(): void {
  }

  open(content) {
    this.quantity = 0;
    this.moneyInWallet = this.localStorageService.getFromLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT);
    let existingStockDetails = this.localStorageService.getFromLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.modalTitle);
    this.currentQuantity = existingStockDetails.quantity;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((quantity) => {
      if ((parseInt(existingStockDetails.quantity) - parseInt(quantity) == 0)) {
        this.localStorageService.deleteFromLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.modalTitle);
      } else {
        this.localStorageService.storeToLocalStorage(ApplicationConstants.PORTFOLIO_CATEGORY_LOCAL_STORAGE, this.modalTitle, {
          ticker: existingStockDetails.ticker,
          companyName: existingStockDetails.companyName,
          quantity: parseInt(existingStockDetails.quantity) - parseInt(quantity),
          totalCost: (existingStockDetails.totalCost - quantity * this.currentPriceOfStock)
        });
      }

      this.localStorageService.storeToLocalStorage(ApplicationConstants.WALLET_CATEGORY_LOCAL_STORAGE, ApplicationConstants.MONEY_IN_WALLET_CONSTANT, this.moneyInWallet + quantity * this.currentPriceOfStock);
      this.actionHappened.emit();
      this.localStorageAlertService.theItem = 'someValue';
    });
  }
}
