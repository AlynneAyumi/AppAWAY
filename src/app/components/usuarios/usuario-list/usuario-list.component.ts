import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario, PerfilUsuario, UsuarioFiltro } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
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
  searchTimeout: any;

  filtro: UsuarioFiltro = {
    page: 0,
    size: 10
  };

  perfilOptions = Object.values(PerfilUsuario);

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.usuarioService.listar(this.filtro).subscribe({
      next: (response) => {
        this.usuarios = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar usuários',
          text: error.error || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  pesquisar(): void {
    this.filtro.page = 0;
    this.carregarUsuarios();
  }

  // Busca em tempo real quando o usuário digita
  onSearchInput(): void {
    // Debounce para evitar muitas requisições
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pesquisar();
    }, 300); // Aguarda 300ms após parar de digitar
  }

  limparFiltros(): void {
    this.filtro = {
      page: 0,
      size: 10
    };
    this.carregarUsuarios();
  }

  alterarPagina(pagina: number): void {
    this.filtro.page = pagina;
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

  getPaginas(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(0, this.currentPage - 2);
    const fim = Math.min(this.totalPages - 1, this.currentPage + 2);
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  novoUsuario(): void {
    this.router.navigate(['/usuarios/novo']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  visualizarUsuario(usuario: Usuario): void {
    this.router.navigate(['/usuarios/visualizar', usuario.id]);
  }

  excluirUsuario(usuario: Usuario): void {
    if (!usuario.id) return;

    Swal.fire({
      title: 'Confirmar Exclusão',
      text: `Tem certeza que deseja excluir o usuário ${usuario.nome}?`,
      html: `
        <div style="text-align: left;">
          <p><strong>Nome:</strong> ${usuario.nome}</p>
          <p><strong>E-mail:</strong> ${usuario.email}</p>
          <p><strong>Perfil:</strong> ${this.getPerfilText(usuario.perfil)}</p>
          <br>
          <p style="color: #dc3545; font-weight: bold;">⚠️ ATENÇÃO: Esta ação não pode ser desfeita!</p>
          <p style="color: #dc3545;">O usuário será excluído permanentemente do sistema.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir permanentemente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      width: '500px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.usuarioService.excluir(usuario.id!).subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Usuário excluído com sucesso!',
              text: 'O usuário foi removido permanentemente do sistema.',
              timer: 3000,
              showConfirmButton: false
            });
            this.carregarUsuarios();
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao excluir usuário:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir usuário',
              text: error.message || error.error?.message || 'Erro interno do servidor',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
}
