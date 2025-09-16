import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComparecimentoService } from '../../../services/comparecimento.service';
import { Comparecimento, ComparecimentoFiltro, EnumSituacao } from '../../../models/assistido.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comparecimento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparecimento-list.component.html',
  styleUrl: './comparecimento-list.component.scss'
})
export class ComparecimentoListComponent implements OnInit {
  comparecimentos: Comparecimento[] = [];
  filtro: ComparecimentoFiltro = {
    page: 0,
    size: 10
  };
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;

  // Opções para os selects
  statusOptions = Object.values(EnumSituacao);
  EnumSituacao = EnumSituacao; // Para usar no template

  constructor(private comparecimentoService: ComparecimentoService) {}

  ngOnInit(): void {
    this.carregarComparecimentos();
  }

  carregarComparecimentos(): void {
    this.loading = true;
    this.comparecimentoService.listar(this.filtro).subscribe({
      next: (response) => {
        this.comparecimentos = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.currentPage = response.number || 0;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar comparecimentos',
          text: error.error || 'Erro interno do servidor',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  pesquisar(): void {
    this.filtro.page = 0;
    this.carregarComparecimentos();
  }

  limparFiltros(): void {
    this.filtro = {
      page: 0,
      size: 10
    };
    this.carregarComparecimentos();
  }

  alterarPagina(pagina: number): void {
    this.filtro.page = pagina;
    this.carregarComparecimentos();
  }

  confirmarComparecimento(comparecimento: Comparecimento): void {
    if (!comparecimento.idComparecimento) return;

    Swal.fire({
      title: 'Confirmar Comparecimento',
      text: `Confirmar que o assistido compareceu?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comparecimentoService.confirmar(comparecimento.idComparecimento!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Comparecimento confirmado!',
              timer: 2000,
              showConfirmButton: false
            });
            this.carregarComparecimentos();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao confirmar comparecimento',
              text: error.error || 'Erro interno do servidor',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  registrarFalta(comparecimento: Comparecimento): void {
    if (!comparecimento.idComparecimento) return;

    Swal.fire({
      title: 'Registrar Falta',
      text: `Registrar falta do assistido?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, registrar falta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comparecimentoService.registrarFalta(comparecimento.idComparecimento!).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Falta registrada!',
              timer: 2000,
              showConfirmButton: false
            });
            this.carregarComparecimentos();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao registrar falta',
              text: error.error || 'Erro interno do servidor',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  getStatusClass(status: EnumSituacao): string {
    switch (status) {
      case EnumSituacao.COMPARECEU:
        return 'status-compareceu';
      case EnumSituacao.PENDENTE:
        return 'status-pendente';
      default:
        return '';
    }
  }

  getStatusText(status: EnumSituacao): string {
    switch (status) {
      case EnumSituacao.COMPARECEU:
        return 'Compareceu';
      case EnumSituacao.PENDENTE:
        return 'Pendente';
      default:
        return status;
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
}
