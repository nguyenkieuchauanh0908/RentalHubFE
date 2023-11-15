import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItem } from './post-item.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit, OnDestroy {
  @Input()
  item!: PostItem;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {}

  ngOnDestroy() {}

  goToPost() {
    this.router.navigate(['/posts/', this.item._id]);
  }
}
