import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario, PerfilUsuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-view.component.html',
  styleUrl: './usuario-view.component.scss'
})
export class UsuarioViewComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = false;
  usuarioId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = params['id'] ? +params['id'] : null;
      if (this.usuarioId) {
        this.carregarUsuario();
      }
    });
  }

  carregarUsuario(): void {
    if (!this.usuarioId) return;

    this.loading = true;
    this.usuarioService.buscarPorId(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar usuário',
          text: error.error || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
        this.voltar();
      }
    });
  }

  editar(): void {
    this.router.navigate(['/usuarios/editar', this.usuarioId]);
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }

  getPerfilText(perfil: PerfilUsuario): string {
    switch (perfil) {
      case PerfilUsuario.ADMIN: return 'Administrador';
      case PerfilUsuario.FUNCIONARIO: return 'Funcionário';
      default: return perfil;
    }
  }

  formatarData(data: Date | undefined): string {
    if (!data) return 'Não informado';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  formatarCep(cep: string | undefined): string {
    if (!cep) return 'Não informado';
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  formatarCpf(cpf: string | undefined): string {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string | undefined): string {
    if (!telefone) return 'Não informado';
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }
}

