import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-host-sidebar',
  templateUrl: './host-sidebar.component.html',
  styleUrls: ['./host-sidebar.component.scss'],
})
export class HostSidebarComponent {
  @Input() hostProfile: any | undefined;

  constructor() {
    console.log('🚀 ~ HostSidebarComponent ~ hostProfile:', this.hostProfile);
  }
}
