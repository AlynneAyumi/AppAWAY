import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssistidoService } from '../../../services/assistido.service';
import { Assistido, AssistidoFiltro, StatusAssistido, TipoPena } from '../../../models/assistido.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assistido-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assistido-list.component.html',
  styleUrl: './assistido-list.component.scss'
})
export class AssistidoListComponent implements OnInit {
  assistidos: Assistido[] = [];
  filtro: AssistidoFiltro = {
    page: 0,
    size: 10,
    status: undefined
  };
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;

  // Opções para os selects
  statusOptions = Object.values(StatusAssistido);
  tipoPenaOptions = Object.values(TipoPena);

  constructor(
    private assistidoService: AssistidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarAssistidos();
  }

  carregarAssistidos(): void {
    this.loading = true;
    this.assistidoService.listar(this.filtro).subscribe({
      next: (response) => {
        this.assistidos = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar assistidos',
          text: error.error || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  pesquisar(): void {
    this.filtro.page = 0;
    this.carregarAssistidos();
  }

  limparFiltros(): void {
    this.filtro = {
      page: 0,
      size: 10
    };
    this.carregarAssistidos();
  }

  alterarPagina(pagina: number): void {
    this.filtro.page = pagina;
    this.carregarAssistidos();
  }

  excluirAssistido(assistido: Assistido): void {
    if (!assistido.id) return;

    Swal.fire({
      title: 'Confirmar Exclusão',
      text: `Tem certeza que deseja excluir o assistido ${assistido.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.assistidoService.excluir(assistido.id!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Assistido excluído com sucesso!',
              timer: 2000,
              showConfirmButton: false
            });
            this.carregarAssistidos();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir assistido',
              text: error.error || 'Erro interno do servidor',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  getStatusClass(status: StatusAssistido): string {
    switch (status) {
      case StatusAssistido.ATIVO:
        return 'status-ativo';
      case StatusAssistido.EM_MONITORAMENTO:
        return 'status-monitoramento';
      case StatusAssistido.DESLIGADO:
        return 'status-desligado';
      default:
        return '';
    }
  }

  getStatusText(status: StatusAssistido): string {
    switch (status) {
      case StatusAssistido.ATIVO:
        return 'Ativo';
      case StatusAssistido.EM_MONITORAMENTO:
        return 'Em Monitoramento';
      case StatusAssistido.DESLIGADO:
        return 'Desligado';
      default:
        return status;
    }
  }

  getTipoPenaText(tipoPena: TipoPena): string {
    switch (tipoPena) {
      case TipoPena.ALTERNATIVA:
        return 'Pena Alternativa';
      case TipoPena.PRISIONAL:
        return 'Prisional';
      default:
        return tipoPena;
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

  novoAssistido(): void {
    this.router.navigate(['/assistidos/novo']);
  }

  editarAssistido(assistido: Assistido): void {
    this.router.navigate(['/assistidos/editar', assistido.id]);
  }
}
