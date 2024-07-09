import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentPackagesComponent } from './payment-packages/payment-packages.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'packages',
        component: PaymentPackagesComponent,
        canActivate: [AuthGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
