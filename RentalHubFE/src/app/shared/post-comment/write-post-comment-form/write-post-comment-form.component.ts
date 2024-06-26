import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { ForumService } from 'src/app/forum/forum.service';
import { PostCommentModel } from './post-comment.model';

@Component({
  selector: 'app-write-post-comment-form',
  templateUrl: './write-post-comment-form.component.html',
  styleUrls: ['./write-post-comment-form.component.scss'],
})
export class WritePostCommentFormComponent implements OnInit, OnDestroy {
  @Input() commentForParent: {
    creatorName: string | null;
    creatorId: string | null;
  } = { creatorId: null, creatorName: null };
  @Input() commentForPostId!: string;
  @Output() createCommentSuccess = new EventEmitter<PostCommentModel[]>();
  $destroy: Subject<boolean> = new Subject();
  currentUser: User | null = null;
  isNotSubmitted: boolean = true;
  showEmojiPicker: boolean = false;
  commentEditForm = this.formBuilder.group({
    commentInputControl: [{ value: '', disabled: false }, Validators.required],
  });

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private forumService: ForumService,
    private notifierService: NotifierService
  ) {}
  ngOnInit(): void {
    this.isNotSubmitted = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  submitComment() {
    this.isNotSubmitted = false;
    console.log(this.commentEditForm.value.commentInputControl);
    //Call API to submit comment
    this.forumService
      .createComment(
        this.commentForPostId,
        this.commentForParent.creatorId,
        this.commentEditForm.value.commentInputControl!,
        null
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        if (res.data) {
          this.notifierService.notify('success', 'Gửi bình luận thành công!');
          this.commentEditForm.patchValue({
            commentInputControl: '',
          });
          this.showEmojiPicker = false;
          this.createCommentSuccess.emit(res.data);
        }
      });
  }

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    let comment = this.commentEditForm.value.commentInputControl;
    const text = `${comment}${event.emoji.native}`;
    this.commentEditForm.patchValue({
      commentInputControl: text,
    });
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
}
