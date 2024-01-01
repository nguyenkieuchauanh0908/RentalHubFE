import { RouterModule, Routes } from '@angular/router';
import { HostComponent } from './host.component';
import { HostPostingHistoryComponent } from './host-posting-history/host-posting-history.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HostComponent,
    children: [
      {
        path: 'post-history/:id',
        component: HostPostingHistoryComponent,
        canActivate: [AuthGuard],
      },
      //Host Messenger
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostRoutingModule {}
