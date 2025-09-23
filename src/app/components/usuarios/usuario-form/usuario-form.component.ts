import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario, PerfilUsuario, Pessoa, Endereco } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {
  usuario: Usuario = {
    nome: '',
    nomeUser: '',
    email: '',
    senha: '',
    perfil: PerfilUsuario.AGENTE,
    ativo: true,
    pessoa: {
      cpf: '',
      nome: '',
      segundoNome: '',
      telefone: '',
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    }
  };

  loading = false;
  salvando = false;
  isEdit = false;
  usuarioId: number | null = null;

  perfilOptions = Object.values(PerfilUsuario);

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.usuarioId;
      
      if (this.isEdit) {
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

  salvar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.salvando = true;

    if (this.isEdit) {
      this.atualizarUsuario();
    } else {
      this.criarUsuario();
    }
  }

  criarUsuario(): void {
    this.usuarioService.criar(this.usuario).subscribe({
      next: (response) => {
        this.salvando = false;
        Swal.fire({
          icon: 'success',
          title: 'Usuário criado com sucesso!',
          text: `O usuário ${this.usuario.nome} foi criado com sucesso.`,
          timer: 3000,
          showConfirmButton: false
        });
        this.voltar();
      },
      error: (error) => {
        this.salvando = false;
        console.error('Erro ao criar usuário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao criar usuário',
          text: error.message || error.error?.message || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  atualizarUsuario(): void {
    if (!this.usuarioId) return;

    this.usuarioService.atualizar(this.usuarioId, this.usuario).subscribe({
      next: (response) => {
        this.salvando = false;
        Swal.fire({
          icon: 'success',
          title: 'Usuário atualizado com sucesso!',
          text: `O usuário ${this.usuario.nome} foi atualizado com sucesso.`,
          timer: 3000,
          showConfirmButton: false
        });
        this.voltar();
      },
      error: (error) => {
        this.salvando = false;
        console.error('Erro ao atualizar usuário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar usuário',
          text: error.message || error.error?.message || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.usuario.nome?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nome obrigatório',
        text: 'Por favor, informe o nome do usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!this.usuario.email?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'E-mail obrigatório',
        text: 'Por favor, informe o e-mail do usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!this.usuario.nomeUser?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nome de usuário obrigatório',
        text: 'Por favor, informe o nome de usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!this.isEdit && !this.usuario.senha?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Senha obrigatória',
        text: 'Por favor, informe a senha do usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!this.usuario.pessoa?.cpf?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'CPF obrigatório',
        text: 'Por favor, informe o CPF do usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    if (!this.usuario.pessoa?.telefone?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Telefone obrigatório',
        text: 'Por favor, informe o telefone do usuário.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    return true;
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
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
