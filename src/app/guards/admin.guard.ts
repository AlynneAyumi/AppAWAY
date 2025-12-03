import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  
  if (currentUser && currentUser.perfil === 'ADMIN') {
    return true;
  }

  // Mostra mensagem de erro e redireciona para dashboard se não for admin
  Swal.fire({
    icon: 'error',
    title: 'Acesso Negado',
    text: 'Você não tem permissões necessárias para acessar esta página. Contate um administrador.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#6c5ce7'
  }).then(() => {
    router.navigate(['/dashboard']);
  });
  
  return false;
};

