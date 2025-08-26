import { Component } from '@angular/core';
import {Hero} from '../hero/hero';
import {FeaturedProducts} from '../product/product';

@Component({
  selector: 'app-home',
  imports: [
    Hero,
    FeaturedProducts
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
