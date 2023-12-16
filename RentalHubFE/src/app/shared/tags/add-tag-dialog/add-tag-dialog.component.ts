import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Observable, startWith, map } from 'rxjs';
import { PostService } from 'src/app/posts/post.service';
import { Tags } from '../tag.model';

@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.scss'],
})
export class AddTagDialogComponent implements OnInit {
  private chosenTag?: Tags[];
  constructor(
    private postService: PostService,
    private notifierService: NotifierService
  ) {}

  myControl = new FormControl('');
  options!: Tags[];
  filteredOptions: Observable<Tags[]> | undefined;

  ngOnInit() {
    this.postService.getCurrentTags.subscribe((tags: Tags[]) => {
      this.options = tags;
    });
    this.postService.getCurrentChosenTags.subscribe((chosenTags) => {
      this.chosenTag = chosenTags;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): Tags[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option._tag.toLowerCase().includes(filterValue)
    );
  }

  onSubmitPost() {
    console.log('You are creating new tag...', this.myControl.value);
    const tag = this.options.find((tag) => tag._tag === this.myControl.value);
    this.notifierService.hideAll();
    if (tag) {
      if (!this.chosenTag?.includes(tag)) {
        this.chosenTag?.push(tag);

        this.notifierService.notify('success', 'Tạo tag thành công!');
      } else {
        this.notifierService.notify('warning', 'Tag đã được thêm!');
      }
    } else {
      if (this.myControl.value) {
        this.postService.createTag(this.myControl.value).subscribe((res) => {
          if (res.data) {
            //update current tags
            this.notifierService.notify('success', 'Tạo tag thành công!');
            this.options.push(res.data);
            this.postService.setCurrentTags(this.options);
            //update chosen tags
            this.chosenTag?.push(res.data);
          } else {
            this.notifierService.hideAll();
            this.notifierService.notify(
              'error',
              'Tạo tag thất bại! Đã có lỗi xảy ra!'
            );
          }
        });
      }
    }
    if (this.chosenTag) {
      this.postService.setCurrentChosenTags(this.chosenTag);
    }
    this.myControl.reset();
    console.log(
      '🚀 ~ file: add-tag-dialog.component.ts:64 ~ AddTagDialogComponent ~ this.postService.createTag ~ this.chosenTag:',
      this.chosenTag
    );
  }
}
