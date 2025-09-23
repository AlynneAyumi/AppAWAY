import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparecimentoService } from '../../services/comparecimento.service';
import { Comparecimento, EnumSituacao } from '../../models/assistido.model';
import Swal from 'sweetalert2';

interface DiaCalendario {
  data: Date;
  numero: number;
  comparecimentos: Comparecimento[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  dataAtual = new Date();
  mesAtual = this.dataAtual.getMonth();
  anoAtual = this.dataAtual.getFullYear();
  
  diasCalendario: DiaCalendario[] = [];
  comparecimentos: Comparecimento[] = [];
  loading = false;
  
  meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  comparecimentoSelecionado: Comparecimento | null = null;

  constructor(private comparecimentoService: ComparecimentoService) {}

  ngOnInit(): void {
    this.carregarComparecimentos();
  }

  carregarComparecimentos(): void {
    this.loading = true;
    
    // Calcular início e fim do mês
    const inicioMes = new Date(this.anoAtual, this.mesAtual, 1);
    const fimMes = new Date(this.anoAtual, this.mesAtual + 1, 0);
    
    this.comparecimentoService.listar({
      dataInicio: inicioMes,
      dataFim: fimMes,
      page: 0,
      size: 1000
    }).subscribe({
      next: (response) => {
        console.log('Comparecimentos carregados:', response);
        this.comparecimentos = response.content || [];
        console.log('Comparecimentos processados:', this.comparecimentos);
        this.gerarCalendario();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar comparecimentos:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar comparecimentos',
          text: 'Não foi possível carregar os comparecimentos do calendário.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  gerarCalendario(): void {
    this.diasCalendario = [];
    
    // Primeiro dia do mês
    const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1);
    const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0);
    
    // Dia da semana do primeiro dia (0 = domingo)
    const diaSemanaInicio = primeiroDia.getDay();
    
    // Calcular data de início do calendário (pode incluir dias do mês anterior)
    const inicioCalendario = new Date(primeiroDia);
    inicioCalendario.setDate(inicioCalendario.getDate() - diaSemanaInicio);
    
    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
      const data = new Date(inicioCalendario);
      data.setDate(inicioCalendario.getDate() + i);
      
      const isCurrentMonth = data.getMonth() === this.mesAtual;
      const isToday = this.isHoje(data);
      
      // Filtrar comparecimentos para este dia
      const comparecimentosDia = this.comparecimentos.filter(comp => {
        const dataComp = new Date(comp.data);
        return dataComp.toDateString() === data.toDateString();
      });
      
      this.diasCalendario.push({
        data: new Date(data),
        numero: data.getDate(),
        comparecimentos: comparecimentosDia,
        isCurrentMonth,
        isToday
      });
    }
  }

  isHoje(data: Date): boolean {
    const hoje = new Date();
    return data.toDateString() === hoje.toDateString();
  }

  mesAnterior(): void {
    this.mesAtual--;
    if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
    this.carregarComparecimentos();
  }

  mesProximo(): void {
    this.mesAtual++;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    }
    this.carregarComparecimentos();
  }

  irParaHoje(): void {
    const hoje = new Date();
    this.mesAtual = hoje.getMonth();
    this.anoAtual = hoje.getFullYear();
    this.carregarComparecimentos();
  }

  getNomeMes(): string {
    return this.meses[this.mesAtual];
  }

  getTotalComparecimentos(): number {
    return this.comparecimentos.length;
  }

  getTotalComparecidos(): number {
    return this.comparecimentos.filter(c => c.flagComparecimento).length;
  }

  getTotalFaltas(): number {
    return this.comparecimentos.filter(c => !c.flagComparecimento).length;
  }

  getStatusClass(comparecimento: Comparecimento): string {
    return comparecimento.flagComparecimento ? 'status-compareceu' : 'status-falta';
  }

  getStatusText(comparecimento: Comparecimento): string {
    return comparecimento.flagComparecimento ? 'Compareceu' : 'Falta';
  }


  abrirDetalhes(comparecimento: Comparecimento): void {
    console.log('Abrindo detalhes do comparecimento:', comparecimento);
    console.log('Dados do assistido:', comparecimento.assistido);
    console.log('Dados da pessoa:', comparecimento.assistido?.pessoa);
    this.comparecimentoSelecionado = comparecimento;
  }

  fecharDetalhes(): void {
    this.comparecimentoSelecionado = null;
  }
}
