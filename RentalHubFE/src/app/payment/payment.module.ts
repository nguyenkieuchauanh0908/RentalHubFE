import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentPackagesComponent } from './payment-packages/payment-packages.component';
import { RouterModule } from '@angular/router';
import { PaymentRoutingModule } from './payment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { CustomizeOptionDialogComponent } from './payment-option/customize-option-dialog/customize-option-dialog.component';

@NgModule({
  declarations: [PaymentPackagesComponent, PaymentOptionComponent, CustomizeOptionDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    PaymentRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class PaymentModule {}
