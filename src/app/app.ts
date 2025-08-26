import { Component, signal } from '@angular/core';
import {HeaderComponent} from './shared/header/header';
import {Footer} from './shared/footer/footer';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pharmaplus');
}
