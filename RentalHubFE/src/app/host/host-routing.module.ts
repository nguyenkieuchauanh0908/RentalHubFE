import { RouterModule, Routes } from '@angular/router';
import { HostComponent } from './host.component';
import { HostProfileComponent } from './host-profile/host-profile.component';
import { HostPostingHistoryComponent } from './host-posting-history/host-posting-history.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: HostComponent,
    children: [
      {
        path: 'post-history/:uId',
        component: HostPostingHistoryComponent,
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
