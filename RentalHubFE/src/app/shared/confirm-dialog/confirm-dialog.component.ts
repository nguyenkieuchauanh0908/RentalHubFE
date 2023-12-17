import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  public message: string = '';
  confirmYes = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.message = data;
  }
  confirm() {
    this.confirmYes.emit();
  }
}
