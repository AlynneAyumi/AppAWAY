import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AssistidoService } from '../../../services/assistido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assistido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assistido-form.component.html',
  styleUrl: './assistido-form.component.scss'
})
export class AssistidoFormComponent implements OnInit {
  assistidoForm: FormGroup;
  loading = false;
  isEditMode = false;
  assistidoId?: number;

  constructor(
    private fb: FormBuilder,
    private assistidoService: AssistidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.assistidoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      segundoNome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      dataNascimento: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      numProcesso: ['', [Validators.required]],
      numAuto: ['', [Validators.required]],
      observacao: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.assistidoId = +params['id'];
        this.carregarAssistido();
      }
    });
  }

  carregarAssistido(): void {
    if (!this.assistidoId) return;

    this.loading = true;
    this.assistidoService.buscarPorId(this.assistidoId).subscribe({
      next: (assistido) => {
        this.assistidoForm.patchValue({
          nome: assistido.pessoa?.nome || '',
          segundoNome: assistido.pessoa?.segundoNome || '',
          cpf: assistido.pessoa?.cpf || '',
          dataNascimento: assistido.pessoa?.dataNascimento ? new Date(assistido.pessoa.dataNascimento).toISOString().split('T')[0] : '',
          telefone: assistido.pessoa?.telefone || '',
          endereco: assistido.pessoa?.endereco?.logradouro || '',
          numProcesso: assistido.numProcesso || '',
          numAuto: (assistido as any).numAuto || '',
          observacao: assistido.observacao || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Erro ao carregar assistido:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar assistido',
          text: 'Não foi possível carregar os dados do assistido',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/assistidos']);
      }
    });
  }

  onSubmit(): void {
    if (this.assistidoForm.valid) {
      this.loading = true;
      const formValue = this.assistidoForm.value;
      
      const assistidoData = {
        idAssistido: this.assistidoId,
        numProcesso: formValue.numProcesso,
        numAuto: formValue.numAuto,
        observacao: formValue.observacao,
        pessoa: {
          nome: formValue.nome,
          segundoNome: formValue.segundoNome,
          cpf: formValue.cpf,
          dataNascimento: formValue.dataNascimento,
          telefone: formValue.telefone,
          endereco: {
            logradouro: formValue.endereco
          }
        }
      };

      const operacao = this.isEditMode 
        ? this.assistidoService.atualizar(this.assistidoId!, assistidoData as any)
        : this.assistidoService.criar(assistidoData as any);

      operacao.subscribe({
        next: (response) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: `Assistido ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`,
            text: `Assistido foi ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso.`,
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/assistidos']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao salvar assistido:', error);
          Swal.fire({
            icon: 'error',
            title: `Erro ao ${this.isEditMode ? 'atualizar' : 'cadastrar'} assistido`,
            text: 'Verifique os dados e tente novamente',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos obrigatórios corretamente',
        confirmButtonText: 'OK'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/assistidos']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.assistidoForm.controls).forEach(key => {
      const control = this.assistidoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.assistidoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.assistidoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato inválido';
      }
      if (field.errors['cpfInvalid']) {
        return 'CPF inválido. Digite 11 dígitos no formato 000.000.000-00';
      }
    }
    return '';
  }

  // Validador customizado para CPF
  private cpfValidator(control: any) {
    if (!control.value) {
      return null; // Se vazio, deixa o required tratar
    }
    
    const cpf = control.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (cpf.length !== 11) {
      return { cpfInvalid: true };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalid: true };
    }
    
    // Validação do algoritmo do CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 10 ? remainder : 0;
    
    if (digit1 !== parseInt(cpf.charAt(9))) {
      return { cpfInvalid: true };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 10 ? remainder : 0;
    
    if (digit2 !== parseInt(cpf.charAt(10))) {
      return { cpfInvalid: true };
    }
    
    return null; // CPF válido
  }

  // Formatar CPF com máscara
  formatCpf(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      
      event.target.value = value;
      this.assistidoForm.get('cpf')?.setValue(value, { emitEvent: false });
    }
  }

  // Permitir apenas números
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which || event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}