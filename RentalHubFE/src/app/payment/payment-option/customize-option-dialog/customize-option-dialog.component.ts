import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customize-option-dialog',
  templateUrl: './customize-option-dialog.component.html',
  styleUrls: ['./customize-option-dialog.component.scss'],
})
export class CustomizeOptionDialogComponent {
  send = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; label: string; price: number }
  ) {}
  submit(form: any) {
    this.send.emit(form.value.input * this.data.price);
  }
}
