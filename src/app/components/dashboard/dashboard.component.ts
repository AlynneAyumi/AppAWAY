import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistidoService } from '../../services/assistido.service';
import { ComparecimentoService } from '../../services/comparecimento.service';
import { AuthService } from '../../services/auth.service';
import { StatusAssistido, EnumSituacao, Assistido, Comparecimento } from '../../models/assistido.model';

interface AtividadeRecente {
  id: number;
  tipo: 'cadastro' | 'comparecimento' | 'falta';
  descricao: string;
  data: Date;
  assistido?: string;
}

interface ProximoComparecimento {
  id: number;
  horario: string;
  data: string;
  assistido: string;
  status: 'compareceu' | 'pendente';
}

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

  atividadesRecentes: AtividadeRecente[] = [];
  proximosComparecimentos: ProximoComparecimento[] = [];
  loading = true;
  carregamentosCompletos = 0;
  totalCarregamentos = 4;
  
  // Estados de expansão
  atividadesExpandidas = false;
  comparecimentosExpandidos = false;

  constructor(
    private assistidoService: AssistidoService,
    private comparecimentoService: ComparecimentoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.loading = true;
    this.carregamentosCompletos = 0;

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

    // Carregar assistidos ativos (todos os assistidos são considerados ativos por padrão)
    this.assistidoService.listar({ page: 0, size: 1000 }).subscribe({
      next: (response) => {
        const assistidos = response.content || [];
        // Como todos os assistidos são considerados ativos por padrão no mapper
        this.stats.assistidosAtivos = assistidos.length;
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar assistidos ativos:', error);
        this.verificarCarregamentoCompleto();
      }
    });

    // Carregar comparecimentos de hoje
    this.comparecimentoService.listar().subscribe({
      next: (response) => {
        const comparecimentos = response.content || [];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        
        // Comparecimentos de hoje
        this.stats.comparecimentosHoje = comparecimentos.filter((c: Comparecimento) => {
          const dataComparecimento = new Date(c.data);
          return dataComparecimento >= hoje && dataComparecimento < amanha;
        }).length;
        
        // Comparecimentos pendentes (futuros que não compareceram)
        this.stats.comparecimentosPendentes = comparecimentos.filter((c: Comparecimento) => {
          const dataComparecimento = new Date(c.data);
          return dataComparecimento >= hoje && !c.flagComparecimento;
        }).length;
        
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar comparecimentos:', error);
        this.verificarCarregamentoCompleto();
      }
    });

    // Carregar atividades recentes e próximos comparecimentos
    this.carregarAtividadesRecentes();
    this.carregarProximosComparecimentos();
  }

  private carregarAtividadesRecentes(): void {
    // Carregar assistidos recentes para atividades
    this.assistidoService.listar({ page: 0, size: 10 }).subscribe({
      next: (response) => {
        const assistidos = response.content || [];
        this.atividadesRecentes = assistidos
          .sort((a: Assistido, b: Assistido) => {
            // Ordenar por data de criação mais recente
            const dataA = a.creationDate ? new Date(a.creationDate) : new Date(0);
            const dataB = b.creationDate ? new Date(b.creationDate) : new Date(0);
            return dataB.getTime() - dataA.getTime();
          })
          .slice(0, 3)
          .map((assistido: Assistido, index: number) => ({
            id: assistido.id || index,
            tipo: 'cadastro' as const,
            descricao: 'Novo assistido cadastrado',
            data: assistido.creationDate ? new Date(assistido.creationDate) : new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000),
            assistido: assistido.nome || assistido.pessoa?.nome
          }));
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar atividades recentes:', error);
        this.verificarCarregamentoCompleto();
      }
    });
  }

  private carregarProximosComparecimentos(): void {
    this.comparecimentoService.listar().subscribe({
      next: (response) => {
        const comparecimentos = response.content || [];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const proximosDias = new Date(hoje);
        proximosDias.setDate(proximosDias.getDate() + 7); // Próximos 7 dias
        
        this.proximosComparecimentos = comparecimentos
          .filter((c: Comparecimento) => {
            const dataComparecimento = new Date(c.data);
            return dataComparecimento >= hoje && dataComparecimento <= proximosDias;
          })
          .sort((a: Comparecimento, b: Comparecimento) => new Date(a.data).getTime() - new Date(b.data).getTime()) // Ordenar por data
          .slice(0, 3)
          .map((comparecimento: Comparecimento) => {
            const data = new Date(comparecimento.data);
            const hoje = new Date();
            const amanha = new Date(hoje);
            amanha.setDate(amanha.getDate() + 1);
            
            let dataTexto = '';
            if (data.toDateString() === hoje.toDateString()) {
              dataTexto = 'Hoje';
            } else if (data.toDateString() === amanha.toDateString()) {
              dataTexto = 'Amanhã';
            } else {
              dataTexto = data.toLocaleDateString('pt-BR');
            }
            
            return {
              id: comparecimento.idComparecimento || 0,
              horario: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              data: dataTexto,
              assistido: comparecimento.assistido?.nome || comparecimento.assistido?.pessoa?.nome || 'Nome não disponível',
              status: comparecimento.flagComparecimento ? 'compareceu' : 'pendente'
            };
          });
        this.verificarCarregamentoCompleto();
      },
      error: (error) => {
        console.error('Erro ao carregar próximos comparecimentos:', error);
        this.verificarCarregamentoCompleto();
      }
    });
  }

  private verificarCarregamentoCompleto(): void {
    this.carregamentosCompletos++;
    
    if (this.carregamentosCompletos >= this.totalCarregamentos) {
      // Simular carregamento mínimo para melhor UX
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }

  formatarTempoRelativo(data: Date): string {
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);
    
    if (diffDias > 0) {
      return diffDias === 1 ? 'Ontem' : `Há ${diffDias} dias`;
    } else if (diffHoras > 0) {
      return `Há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    } else {
      return 'Agora mesmo';
    }
  }

  alternarAtividades(): void {
    this.atividadesExpandidas = !this.atividadesExpandidas;
  }

  alternarComparecimentos(): void {
    this.comparecimentosExpandidos = !this.comparecimentosExpandidos;
  }

  getAtividadesVisiveis(): AtividadeRecente[] {
    return this.atividadesExpandidas ? this.atividadesRecentes : this.atividadesRecentes.slice(0, 3);
  }

  getComparecimentosVisiveis(): ProximoComparecimento[] {
    return this.comparecimentosExpandidos ? this.proximosComparecimentos : this.proximosComparecimentos.slice(0, 3);
  }
}
