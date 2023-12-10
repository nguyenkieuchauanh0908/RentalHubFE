import { NgModule } from '@angular/core';
import { HostComponent } from './host.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostRoutingModule } from './host-routing.module';
import { HostProfileComponent } from './host-profile/host-profile.component';
import { HostSidebarComponent } from './host-sidebar/host-sidebar.component';
import { HostPostingHistoryComponent } from './host-posting-history/host-posting-history.component';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HostComponent,
    HostProfileComponent,
    HostSidebarComponent,
    HostPostingHistoryComponent,
  ],
  imports: [CommonModule, FormsModule, HostRoutingModule, SharedModule],
  providers: [],
})
export class HostsModule {}
