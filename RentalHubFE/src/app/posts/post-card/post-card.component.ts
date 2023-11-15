import { Component, Input, OnInit } from '@angular/core';
import { PostItem } from '../posts-list/post-item/post-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent {
  @Input() post!: PostItem;

  constructor(private router: Router) {}

  goToPost() {
    this.router.navigate(['/posts/', this.post._id]);
  }
}
