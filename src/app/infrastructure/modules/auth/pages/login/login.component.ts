import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  standalone: true,
  selector: 'sp-login',
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG (para usar p-dropdown, pInputText, p-password y pButton)
    DropdownModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = '';
  pwd = '';
  selectedProfile = '';
  error = '';
  loading = false;

  profiles = [
    { id: 'LIMA NORTE', label: 'CSJLima Norte' },
    { id: 'SELVA CENTRAL', label: 'CSJSelva Central' },
    { id: 'HUANUCO', label: 'CSJHuanuco' },
    { id: 'JUNIN', label: 'CSJJunin' }
  ];

  constructor(private router: Router) {}

  async submit() {
    this.error = '';
    if (!this.user.trim() || !this.pwd.trim() || !this.selectedProfile) {
      this.error = 'Usuario, contraseña y corte son obligatorios';
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigateByUrl('/home');
    }, 300);
  }

  goForgot() {
    if (this.loading) return;
    this.router.navigateByUrl('/auth/forgot');
  }
}
