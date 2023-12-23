import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-host-sidebar',
  templateUrl: './host-sidebar.component.html',
  styleUrls: ['./host-sidebar.component.scss'],
})
export class HostSidebarComponent implements OnInit {
  @Input() hostProfile: any | undefined;

  ngOnInit(): void {
    console.log(this.hostProfile);
  }
}
