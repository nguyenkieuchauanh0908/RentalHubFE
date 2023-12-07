import { Component } from '@angular/core';
import { Tags } from './tag.model';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/posts/post.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent {
  getTagSub = new Subscription();
  sourceTags: Set<Tags> = new Set();
  selectedTags: Set<Tags> = new Set();

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.getTagSub = this.postService.getAllTags().subscribe((res) => {
      if (res.data) {
        console.log('Get tags successfully...');
        res.data.forEach((tag: Tags) => {
          this.sourceTags.add(tag);
        });
      }
    });
  }

  addTag(tag: any) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
  }
}
