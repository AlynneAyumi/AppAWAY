import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssistidoService } from '../../../services/assistido.service';
import { ComparecimentoService } from '../../../services/comparecimento.service';
import { Assistido, AssistidoFiltro, StatusAssistido, TipoPena, Comparecimento } from '../../../models/assistido.model';
import { Documento, TipoDocumento } from '../../../models/documento.model';
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
  searchTimeout: any;

  // Opções para os selects
  statusOptions = Object.values(StatusAssistido);
  tipoPenaOptions = Object.values(TipoPena);

  // Propriedades do modal de comparecimento
  showComparecimentoModal = false;
  assistidoSelecionado: Assistido | null = null;
  salvandoComparecimento = false;
  comparecimentoForm = {
    data: new Date().toISOString().split('T')[0], // Data atual
    flagComparecimento: true,
    observacoes: ''
  };

  // Propriedades do modal de documentos
  showDocumentosModal = false;
  showNovoDocumentoForm = false;
  documentosAssistido: Documento[] = [];
  salvandoDocumento = false;
  documentoForm = {
    nome: '',
    tipo: '',
    descricao: '',
    arquivo: null as File | null
  };

  constructor(
    private assistidoService: AssistidoService,
    private comparecimentoService: ComparecimentoService,
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

  // Busca em tempo real quando o usuário digita
  onSearchInput(): void {
    // Debounce para evitar muitas requisições
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pesquisar();
    }, 300); // Aguarda 300ms após parar de digitar
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
      text: `Tem certeza que deseja excluir o assistido ${assistido.pessoa?.nome} ${assistido.pessoa?.segundoNome}?`,
      html: `
        <div style="text-align: left;">
          <p><strong>Nome:</strong> ${assistido.pessoa?.nome} ${assistido.pessoa?.segundoNome}</p>
          <p><strong>CPF:</strong> ${assistido.pessoa?.cpf}</p>
          <p><strong>Processo:</strong> ${assistido.numProcesso}</p>
          <br>
          <p style="color: #dc3545; font-weight: bold;">⚠️ ATENÇÃO: Esta ação não pode ser desfeita!</p>
          <p style="color: #dc3545;">Todos os dados relacionados (pessoa, endereço, comparecimentos) serão excluídos permanentemente.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir permanentemente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      width: '500px'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.assistidoService.excluir(assistido.id!).subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Assistido excluído com sucesso!',
              text: response.message || 'Assistido e todos os dados relacionados foram removidos permanentemente.',
              timer: 3000,
              showConfirmButton: false
            });
            this.carregarAssistidos();
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao excluir assistido:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao excluir assistido',
              text: error.message || error.error?.message || 'Erro interno do servidor',
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

  // Métodos do modal de comparecimento
  registrarComparecimento(assistido: Assistido): void {
    this.assistidoSelecionado = assistido;
    this.showComparecimentoModal = true;
    // Reset do form
    this.comparecimentoForm = {
      data: new Date().toISOString().split('T')[0],
      flagComparecimento: true,
      observacoes: ''
    };
  }

  fecharModalComparecimento(): void {
    this.showComparecimentoModal = false;
    this.assistidoSelecionado = null;
  }

  salvarComparecimento(): void {
    if (!this.assistidoSelecionado || !this.comparecimentoForm.data) {
      Swal.fire({
        icon: 'warning',
        title: 'Dados obrigatórios',
        text: 'Por favor, preencha a data do comparecimento',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.salvandoComparecimento = true;

    const comparecimento: any = {
      data: this.comparecimentoForm.data,
      flagComparecimento: this.comparecimentoForm.flagComparecimento,
      observacoes: this.comparecimentoForm.observacoes,
      assistido: {
        idAssistido: this.assistidoSelecionado.idAssistido
      }
    };

    this.comparecimentoService.criar(comparecimento).subscribe({
      next: (response) => {
        this.salvandoComparecimento = false;
        Swal.fire({
          icon: 'success',
          title: 'Comparecimento registrado!',
          text: `Comparecimento de ${this.assistidoSelecionado?.pessoa?.nome} foi registrado com sucesso.`,
          timer: 3000,
          showConfirmButton: false
        });
        this.fecharModalComparecimento();
        // Opcional: recarregar a lista para atualizar status
        this.carregarAssistidos();
      },
      error: (error) => {
        this.salvandoComparecimento = false;
        console.error('Erro ao salvar comparecimento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao registrar comparecimento',
          text: 'Houve um problema ao salvar o comparecimento. Tente novamente.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  // Métodos do modal de documentos
  gerenciarDocumentos(assistido: Assistido): void {
    this.assistidoSelecionado = assistido;
    this.showDocumentosModal = true;
    this.showNovoDocumentoForm = false;
    this.carregarDocumentosAssistido();
  }

  fecharModalDocumentos(): void {
    this.showDocumentosModal = false;
    this.showNovoDocumentoForm = false;
    this.assistidoSelecionado = null;
    this.documentosAssistido = [];
  }

  carregarDocumentosAssistido(): void {
    // Por enquanto, simular dados vazios
    // Quando houver serviço de documentos, implementar aqui
    this.documentosAssistido = [];
  }

  novoDocumento(): void {
    this.showNovoDocumentoForm = true;
    this.documentoForm = {
      nome: '',
      tipo: '',
      descricao: '',
      arquivo: null
    };
  }

  cancelarNovoDocumento(): void {
    this.showNovoDocumentoForm = false;
    this.documentoForm = {
      nome: '',
      tipo: '',
      descricao: '',
      arquivo: null
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.documentoForm.arquivo = file;
    }
  }

  salvarDocumento(): void {
    if (!this.documentoForm.nome || !this.documentoForm.tipo || !this.documentoForm.arquivo) {
      Swal.fire({
        icon: 'warning',
        title: 'Dados obrigatórios',
        text: 'Por favor, preencha nome, tipo e selecione um arquivo',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.salvandoDocumento = true;

    // Simular salvamento por enquanto
    setTimeout(() => {
      this.salvandoDocumento = false;
      Swal.fire({
        icon: 'success',
        title: 'Documento salvo!',
        text: `Documento "${this.documentoForm.nome}" foi salvo com sucesso.`,
        timer: 3000,
        showConfirmButton: false
      });
      this.cancelarNovoDocumento();
      this.carregarDocumentosAssistido();
    }, 2000);
  }

  excluirDocumento(documento: Documento): void {
    Swal.fire({
      title: 'Confirmar Exclusão',
      text: `Tem certeza que deseja excluir o documento "${documento.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Documento excluído!',
          timer: 2000,
          showConfirmButton: false
        });
        this.carregarDocumentosAssistido();
      }
    });
  }

  getTipoDocumentoText(tipo: TipoDocumento): string {
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
