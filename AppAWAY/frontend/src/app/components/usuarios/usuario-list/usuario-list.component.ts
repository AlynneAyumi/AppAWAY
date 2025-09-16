import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario, PerfilUsuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;

  perfilOptions = Object.values(PerfilUsuario);

  constructor() {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    // Simular carregamento
    setTimeout(() => {
      this.usuarios = [];
      this.loading = false;
    }, 1000);
  }

  pesquisar(): void {
    this.carregarUsuarios();
  }

  limparFiltros(): void {
    this.carregarUsuarios();
  }

  getPerfilText(perfil: PerfilUsuario): string {
    switch (perfil) {
      case PerfilUsuario.ADMINISTRADOR: return 'Administrador';
      case PerfilUsuario.SUPERVISOR: return 'Supervisor';
      case PerfilUsuario.AGENTE: return 'Agente';
      default: return perfil;
    }
  }
}
