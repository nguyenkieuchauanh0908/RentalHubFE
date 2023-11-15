import { Component, Input } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-host-card',
  templateUrl: './host-card.component.html',
  styleUrls: ['./host-card.component.scss'],
})
export class HostCardComponent {
  @Input()
  host: {
    fname: string;
    lname: string;
    phone: string;
    avatar: string;
  } = {
    fname: 'Nguyễn Kiều',
    lname: 'Châu Anh',
    phone: '0913935810',
    avatar:
      'https://static.tapchitaichinh.vn/w640/images/upload/hoangthuviet/12172018/084806baoxaydung_image001.jpg',
  };
}
