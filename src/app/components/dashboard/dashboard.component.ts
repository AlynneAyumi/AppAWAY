import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistidoService } from '../../services/assistido.service';
import { ComparecimentoService } from '../../services/comparecimento.service';
import { StatusAssistido, EnumSituacao } from '../../models/assistido.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = {
    totalAssistidos: 0,
    assistidosAtivos: 0,
    comparecimentosHoje: 0,
    comparecimentosPendentes: 0
  };

  loading = true;

  constructor(
    private assistidoService: AssistidoService,
    private comparecimentoService: ComparecimentoService
  ) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.loading = true;

    // Dados mockados para demonstração - REMOVER quando backend estiver disponível
    setTimeout(() => {
      this.stats = {
        totalAssistidos: 156,
        assistidosAtivos: 142,
        comparecimentosHoje: 8,
        comparecimentosPendentes: 23
      };
      this.loading = false;
    }, 1500);

    // Código original comentado - descomente quando backend estiver disponível
    /*
    // Carregar estatísticas de assistidos
    this.assistidoService.listar({ page: 0, size: 1 }).subscribe({
      next: (response) => {
        this.stats.totalAssistidos = response.totalElements || 0;
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar assistidos:', error);
        this.verificarCarregamentoCompleto();
      }
    });

    // Carregar assistidos ativos
    this.assistidoService.listar({ status: StatusAssistido.ATIVO, page: 0, size: 1 }).subscribe({
      next: (response) => {
        this.stats.assistidosAtivos = response.totalElements || 0;
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar assistidos ativos:', error);
        this.verificarCarregamentoCompleto();
      }
    });

    // Carregar comparecimentos de hoje
    const hoje = new Date();
    this.comparecimentoService.listar({ 
      dataInicio: hoje, 
      dataFim: hoje, 
      page: 0, 
      size: 1 
    }).subscribe({
      next: (response) => {
        this.stats.comparecimentosHoje = response.totalElements || 0;
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar comparecimentos:', error);
        this.verificarCarregamentoCompleto();
      }
    });

    // Carregar comparecimentos pendentes
    this.comparecimentoService.listar({ 
      status: EnumSituacao.PENDENTE, 
      page: 0, 
      size: 1 
    }).subscribe({
      next: (response) => {
        this.stats.comparecimentosPendentes = response.totalElements || 0;
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar comparecimentos pendentes:', error);
        this.verificarCarregamentoCompleto();
      }
    });
    */
  }

  private verificarCarregamentoCompleto(): void {
    // Simular carregamento mínimo para melhor UX
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
