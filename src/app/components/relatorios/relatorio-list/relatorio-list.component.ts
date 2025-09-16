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
  }
}
