import { Component, OnDestroy, OnInit } from '@angular/core';
import { ForumService } from '../forum.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SocialPostEditDialogComponent } from '../social-post-edit-dialog/social-post-edit-dialog.component';

@Component({
  selector: 'app-forum-sidemenu',
  templateUrl: './forum-sidemenu.component.html',
  styleUrls: ['./forum-sidemenu.component.scss'],
})
export class ForumSidemenuComponent implements OnInit, OnDestroy {
  $destroy: Subject<Boolean> = new Subject();
  constructor(private forumService: ForumService, public dialog: MatDialog) {}
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$destroy.unsubscribe();
  }

  openCreateSocialPostDialog() {
    const dialogRef = this.dialog.open(SocialPostEditDialogComponent, {
      width: '800px',
    });
  }
}
