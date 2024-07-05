import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { ForumService } from 'src/app/forum/forum.service';
import { ChatBotService, UserChatsType } from '../chat-bot/chat-bot.service';
import { AccountService } from 'src/app/accounts/accounts.service';
import { User } from 'src/app/auth/user.model';
import { NavigationExtras, Router } from '@angular/router';
import { PostCommentModel } from './write-post-comment-form/post-comment.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PostCommentEditDialogComponent } from './post-comment-edit-dialog/post-comment-edit-dialog.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
})
export class PostCommentComponent implements OnInit, OnDestroy {
  @Input() notiCommentTree: PostCommentModel[] | null = null;
  @Input() comment!: PostCommentModel;
  @Output() deleteCommentSuccess = new EventEmitter();
  @Output() updateCommentSuccess = new EventEmitter<PostCommentModel[]>();

  @Output() deleteChildCmtSuccess = new EventEmitter();
  moment!: any;
  $destroy: Subject<Boolean> = new Subject();
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;
  shouldOpenReplies: boolean = false;
  replies: PostCommentModel[] = [];
  commentForParent: {
    creatorName: string | null;
    creatorId: string | null;
  } = { creatorId: null, creatorName: null };

  currentReplyPage: number = 0;
  totalReplyPage: number = 1;
  replyLimit: number = 5;

  sliderImages: Array<object> = [];

  constructor(
    private forumService: ForumService,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private router: Router,
    public dialog: MatDialog,
    private notifierService: NotifierService
  ) {}
  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  ngOnInit(): void {
    if (this.notiCommentTree) {
      console.log('notiCmtTree 1', this.notiCommentTree);
    }
    this.moment = moment;
    this.moment.locale('vn');
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.commentForParent = {
            creatorId: this.comment._id,
            creatorName: this.comment._name,
          };
          this.comment._images.forEach((img) => {
            this.sliderImages.push({
              image: img,
              thumbImage: img,
            });
          });
        } else {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  addToContactAndGoToChatBot() {
    console.log('addToContactAndGoToChatBot');
    if (this.currentUser && this.comment._uId) {
      //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
      let updatedChats: UserChatsType[] | null = null;
      this.chatBotService
        .createNewChat(this.currentUser._id, this.comment._uId)
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            this.chatBotService.setChatBotMenuOpened(true);
            this.chatBotService.setSeeContactList(false);
            this.chatBotService.getCurrentUserChats.subscribe((chats) => {
              if (chats) {
                updatedChats = chats;
              }
            });
            //Kiểm tra xem chat đã tồn tại chưa, nếu chưa thì cập nhật lại userChats
            let chatExisted = false;
            for (let i = 0; i < updatedChats!.length; i++) {
              if (updatedChats![i]._id === res.data._id) {
                chatExisted = true;
                break;
              }
            }
            if (!chatExisted) {
              this.chatBotService.setCurrentUserChats([
                res.data,
                ...updatedChats!,
              ]);
            }

            this.chatBotService.setCurrentChat(res.data);
          }
        });
    }
  }

  seeProfile() {
    let navigationExtras: NavigationExtras = {
      state: {
        profileName: this.comment._name,
        profileImage: this.comment._avatar,
      },
    };

    this.router.navigate(
      ['/forum/profile', this.comment._uId],
      navigationExtras
    );
  }

  openReplies() {
    this.shouldOpenReplies = !this.shouldOpenReplies;
    if (
      this.shouldOpenReplies &&
      this.currentReplyPage === 0 &&
      this.comment.totalReplies > 0
    ) {
      this.loadReplies();
    }
  }

  loadReplies() {
    this.currentReplyPage += 1;
    if (this.currentReplyPage <= this.totalReplyPage) {
      this.forumService
        .getRepliesOfAParentComment(
          this.comment._id,
          this.currentReplyPage,
          this.replyLimit
        )
        .pipe(takeUntil(this.$destroy))
        .subscribe((res) => {
          if (res.data) {
            let resDt: PostCommentModel[] = res.data;
            if (this.notiCommentTree) {
              const notiCmtTree = new Set(
                this.notiCommentTree.map((cmt: any) => cmt._id)
              );
              resDt = res.data.filter((cmt: any) => {
                return !notiCmtTree.has(cmt._id);
              });
            }
            if (this.replies === null) {
              this.replies = resDt;
            } else {
              this.replies = this.replies.concat(resDt);
            }
            this.totalReplyPage = res.pagination.total;
          }
        });
    }
  }

  createCommentSuccess(event: any) {
    console.log(event);
    if (event !== null) {
      console.log('updated UI comment...');

      this.replies!.unshift(event);
    }
  }

  editComment() {
    window.scrollTo(0, 0); // Scrolls the page to the top

    const dialogRef = this.dialog.open(PostCommentEditDialogComponent, {
      width: '700px',
      data: this.comment,
    });
    const sub = dialogRef.componentInstance.updateCommentSuccess
      .pipe(takeUntil(this.$destroy))
      .subscribe((updatedCmt) => {
        //Gọi API xóa bình luận và update lại UI
        // this.updateCommentSuccess.emit();
        this.notifierService.notify(
          'success',
          'Cập nhật bình luận thành công!'
        );
        this.comment._content = updatedCmt._content;
        this.comment._images = updatedCmt._images;
        this.sliderImages = [];
        this.comment._images.forEach((img) => {
          this.sliderImages.push({
            image: img,
            thumbImage: img,
          });
        });
      });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  //Xóa bình luận: level 0: Bình luận root, 1: bình luận child
  deleteComment() {
    if (this.currentUser) {
      window.scrollTo(0, 0); // Scrolls the page to the top

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: 'Bạn có chắc muốn xóa bình luận này?',
      });
      const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
        //Gọi API xóa bình luận và update lại UI
        this.forumService.hideComment(this.comment._id).subscribe(
          (res) => {
            if (res.data) {
              this.notifierService.notify(
                'success',
                'Xóa bình luận thành công!'
              );
              if (!this.comment._parentId) {
                this.deleteCommentSuccess.emit();
              } else {
                this.deleteChildCmtSuccess.emit();
              }
            }
          },
          (err) => {
            this.notifierService.notify(
              'error',
              'Đã có lỗi xảy ra, vui lòng thử lại sau'
            );
          }
        );
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.notifierService.notify('warning', 'Phiên đăng nhập đã hết hạn');
      this.router.navigate(['/']);
    }
  }

  //Update UI Xóa bình luận con của bình luận root
  deleteChildCommentSuccess(comment: PostCommentModel) {
    console.log('Update UI after delete successfully', comment);
    this.replies = this.replies!.filter((cmt: PostCommentModel) => {
      return cmt._id !== comment._id;
    });
    console.log(
      '🚀 ~ ForumPostComponent ~ deleteComment ~ this.postCommentsToDisplay:',
      this.replies
    );
  }

  //Xóa bình luận con
  // deleteChildComment() {
  //   if (this.currentUser) {
  //     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //       width: '400px',
  //       data: 'Bạn có chắc muốn xóa bình luận này?',
  //     });
  //     const sub = dialogRef.componentInstance.confirmYes.subscribe(() => {
  //       //Gọi API xóa bình luận và update lại UI
  //       this.forumService.hideComment(this.comment._id).subscribe(
  //         (res) => {
  //           if (res.data) {
  //             this.notifierService.notify(
  //               'success',
  //               'Xóa bình luận thành công!'
  //             );
  //             this.deleteChildCmtSuccess.emit();
  //           }
  //         },
  //         (err) => {
  //           this.notifierService.notify(
  //             'error',
  //             'Đã có lỗi xảy ra, vui lòng thử lại sau'
  //           );
  //         }
  //       );
  //     });
  //     dialogRef.afterClosed().subscribe(() => {
  //       sub.unsubscribe();
  //     });
  //   } else {
  //     this.notifierService.notify('warning', 'Phiên đăng nhập đã hết hạn');
  //     this.router.navigate(['/']);
  //   }
  // }
}
