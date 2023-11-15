import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostsListComponent } from 'src/app/posts/posts-list/posts-list.component';

@Component({
  standalone: true,
  imports: [RouterModule, PostsListComponent],
  selector: 'app-posting-history',
  templateUrl: './posting-history.component.html',
  styleUrls: ['./posting-history.component.scss'],
})
export class PostingHistoryComponent {}
