import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subject, takeUntil } from 'rxjs';
import { AccountService } from 'src/app/accounts/accounts.service';
import {
  ChatBotService,
  UserChatsType,
} from 'src/app/shared/chat-bot/chat-bot.service';
import { ForumService } from '../../forum.service';
import { User } from 'src/app/auth/user.model';
import { PostCommentModel } from 'src/app/shared/post-comment/write-post-comment-form/post-comment.model';

@Component({
  selector: 'app-search-result-account',
  templateUrl: './search-result-account.component.html',
  styleUrls: ['./search-result-account.component.scss'],
})
export class SearchResultAccountComponent {
  $destroy: Subject<Boolean> = new Subject();
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  seeMore: boolean = false;
  currentUser: User | null = null;
  currentChat: UserChatsType | null = null;

  postCommentsToDisplay: PostCommentModel[] | null = null;
  currentCommentPage: number = 0;
  commentLimt: number = 5;
  totalCommentPage: number = 1;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private accountService: AccountService,
    private chatBotService: ChatBotService,
    private notifierService: NotifierService,
    private forumService: ForumService
  ) {}
  ngAfterViewInit(): void {
    // this.socialContentToDisplay!.nativeElement.innerHTML = this.post._content;
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.accountService.getCurrentUser
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        if (user) {
          this.isAuthenticated = !!user;
          this.currentUser = user;
          // if (this.post) {
          //   this.isLoading = false;
          //   if (this.post._totalComment > 0) {
          //     // this.loadComments();
          //     // this.forumService
          //     //   .getParentCommentsOfPost(
          //     //     this.post._id,
          //     //     this.currentCommentPage,
          //     //     this.commentLimt
          //     //   )
          //     //   .pipe(takeUntil(this.$destroy))
          //     //   .subscribe(
          //     //     (res) => {
          //     //       if (res.data) {
          //     //         this.postCommentsToDisplay = res.data;
          //     //         this.totalCommentPage = res.pagination.total;
          //     //       }
          //     //     },
          //     //     (err) => {}
          //     //   );
          //   }
          // }
        } else {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called');
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

  addToContactAndGoToChatBot() {
    console.log('addToContactAndGoToChatBot');
    // if (this.currentUser && this.post._authorId) {
    //   //Thêm chat mới vào chat's list (nếu chưa có trong chat list); update lại currentChat; update lại trạng thái của chatBotMenu, update lại chats hiển thị
    //   let updatedChats: UserChatsType[] | null = null;
    //   this.chatBotService
    //     .createNewChat(this.currentUser._id, this.post._authorId)
    //     .pipe(takeUntil(this.$destroy))
    //     .subscribe((res) => {
    //       if (res.data) {
    //         this.chatBotService.setChatBotMenuOpened(true);
    //         this.chatBotService.setSeeContactList(false);
    //         this.chatBotService.getCurrentUserChats.subscribe((chats) => {
    //           if (chats) {
    //             updatedChats = chats;
    //           }
    //         });
    //         //Kiểm tra xem chat đã tồn tại chưa, nếu chưa thì cập nhật lại userChats
    //         let chatExisted = false;
    //         for (let i = 0; i < updatedChats!.length; i++) {
    //           if (updatedChats![i]._id === res.data._id) {
    //             chatExisted = true;
    //             break;
    //           }
    //         }
    //         if (!chatExisted) {
    //           this.chatBotService.setCurrentUserChats([
    //             res.data,
    //             ...updatedChats!,
    //           ]);
    //         }

    //         this.chatBotService.setCurrentChat(res.data);
    //       }
    //     });
    // }
  }
  seeProfile() {
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     profileName: this.post._authorName,
    //     profileImage: this.post._images,
    //   },
    // };
    // this.router.navigate(
    //   ['/forum/profile', this.post._authorId],
    //   navigationExtras
    // );
  }
}
