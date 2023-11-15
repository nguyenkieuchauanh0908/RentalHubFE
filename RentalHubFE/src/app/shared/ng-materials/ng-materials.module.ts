import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { NgMaterialsComponent } from './ng-materials.component';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [NgMaterialsComponent],
  imports: [
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  exports: [
    MatListModule,
    MatListModule,
    MatDivider,
    MatIconModule,
    // MatButtonModule,
    // MatDatepickerModule,
    // MatFormFieldModule,
  ],
})
export class NgMaterialsModule {}
