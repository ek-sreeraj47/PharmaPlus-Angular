import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';  // 👈 import Router
import { AuthService } from '../services/auth'; // 👈 correct file

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  constructor(
    private authService: AuthService,
    private router: Router            // 👈 inject Router here
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.authService.login(form.value).subscribe({
      next: () => this.router.navigate(['/shop']),   // 👈 now works
      error: err => alert(err?.error?.error || 'Login failed')
    });
  }
}
