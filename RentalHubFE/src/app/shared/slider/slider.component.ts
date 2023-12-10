import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() sliderItems: any[] = [];

  ngOnInit() {
    console.log(
      '🚀 ~ file: slider.component.ts:10 ~ SliderComponent ~ sliderItems:',
      this.sliderItems
    );
  }
}
