import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Auth} from '../services/auth';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    RouterLink, FormsModule, CommonModule
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  constructor(private authService: Auth) {
  }
  onSubmit(form: any) {
    this.authService.register(form.value).subscribe({
      next: () => alert('Signup successful! Please login.'),
      error: err => alert(err.error?.error || 'Signup Successful! Please login')
    });
  }
}
