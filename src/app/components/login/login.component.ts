import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Login realizado com sucesso!',
            text: `Bem-vindo, ${response.usuario.nome}!`,
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erro no login',
            text: error.error || 'Credenciais inválidas',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos corretamente',
        confirmButtonText: 'OK'
      });
    }
  }
}
