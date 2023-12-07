import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TagsComponent } from './tags/tags.component';
import { NgMaterialsModule } from './ng-materials/ng-materials.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PaginationComponent } from './pagination/pagination.component';
import { SliderComponent } from './slider/slider.component';
import { HostCardComponent } from './host-card/host-card.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    TagsComponent,
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    SliderComponent,
    HostCardComponent,
    MainLayoutComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialsModule,
    RouterModule,
    FormsModule,
    ScrollingModule,
  ],
  exports: [
    CommonModule,
    ScrollingModule,
    NgMaterialsModule,
    TagsComponent,
    HeaderComponent,
    FooterComponent,
    RouterModule,
    PaginationComponent,
    SliderComponent,
    HostCardComponent,
    MainLayoutComponent,
  ],
  // providers: [provideAnimations(), provideHttpClient()], -----> fix double click routerLink bug by deleting it but still dont know why
})
export class SharedModule {}
