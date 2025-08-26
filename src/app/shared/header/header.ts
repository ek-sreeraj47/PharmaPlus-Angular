import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./header.scss']
})
export class HeaderComponent {}
