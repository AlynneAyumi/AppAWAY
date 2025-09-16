import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-relatorio-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-list.component.html',
  styleUrl: './relatorio-list.component.scss'
})
export class RelatorioListComponent implements OnInit {
  relatorios: any[] = [];
  loading = false;

  constructor() {}

  ngOnInit(): void {
    this.carregarRelatorios();
  }

  carregarRelatorios(): void {
    this.loading = true;
    // Simular carregamento
    setTimeout(() => {
      this.relatorios = [];
      this.loading = false;
    }, 1000);
  }

  gerarRelatorio(tipo: string): void {
    console.log('Gerando relatório:', tipo);
    
    // Simular geração de relatório
    switch(tipo) {
      case 'assistidos':
        console.log('Gerando relatório de assistidos...');
        break;
      case 'comparecimentos':
        console.log('Gerando relatório de comparecimentos...');
        break;
      case 'documentos':
        console.log('Gerando relatório de documentos...');
        break;
      case 'atividades':
        console.log('Gerando relatório de atividades...');
        break;
      default:
        console.log('Tipo de relatório não reconhecido:', tipo);
    }
  }
}
