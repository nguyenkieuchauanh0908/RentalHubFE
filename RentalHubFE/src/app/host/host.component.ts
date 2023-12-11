import { Component } from '@angular/core';
export interface HostProfile {
  email: string;
  lname: string;
  fname: string;
  phone: string;
  id: string;
  avatar: string;
}
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
})
export class HostComponent {}
