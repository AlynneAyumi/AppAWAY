import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Documento, DocumentoFiltro, TipoDocumento } from '../../../models/documento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documento-list.component.html',
  styleUrl: './documento-list.component.scss'
})
export class DocumentoListComponent implements OnInit {
  documentos: Documento[] = [];
  filtro: DocumentoFiltro = {
    page: 0,
    size: 10
  };
  loading = false;
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;

  tipoOptions = Object.values(TipoDocumento);

  constructor() {}

  ngOnInit(): void {
    this.carregarDocumentos();
  }

  carregarDocumentos(): void {
    this.loading = true;
    // Simular carregamento
    setTimeout(() => {
      this.documentos = [];
      this.loading = false;
    }, 1000);
  }

  pesquisar(): void {
    this.filtro.page = 0;
    this.carregarDocumentos();
  }

  limparFiltros(): void {
    this.filtro = { page: 0, size: 10 };
    this.carregarDocumentos();
  }

  getTipoText(tipo: TipoDocumento): string {
    switch (tipo) {
      case TipoDocumento.RG: return 'RG';
      case TipoDocumento.CPF: return 'CPF';
      case TipoDocumento.COMPROVANTE_RESIDENCIA: return 'Comprovante de Residência';
      case TipoDocumento.CERTIDAO_CRIMINAL: return 'Certidão Criminal';
      case TipoDocumento.RELATORIO_SOCIAL: return 'Relatório Social';
      case TipoDocumento.OUTROS: return 'Outros';
      default: return tipo;
    }
  }
}
