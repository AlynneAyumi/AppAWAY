import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  currentUser: Usuario | null = null;
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.perfil === 'ADMIN';
  }

  getPerfilText(perfil?: string): string {
    if (!perfil) return 'Funcionário';
    switch (perfil) {
      case 'ADMIN': return 'Administrador';
      case 'FUNCIONARIO': return 'Funcionário';
      default: return 'Funcionário';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    Swal.fire({
      title: 'Confirmar Logout',
      text: 'Tem certeza que deseja sair do sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
