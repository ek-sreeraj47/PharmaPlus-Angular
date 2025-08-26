import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../services/auth';
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
  constructor(private authService: AuthService) {
  }
  onSubmit(form: any) {
    this.authService.signup(form.value).subscribe({
      next: () => alert('Signup successful! Please login.'),
      error: err => alert(err.error?.error || 'Signup failed')
    });
  }
}
