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
        // Formatar CPF se existir
        let cpfFormatado = '';
        if (assistido.pessoa?.cpf) {
          const cpf = assistido.pessoa.cpf.replace(/\D/g, '');
          if (cpf.length === 11) {
            cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          } else {
            cpfFormatado = assistido.pessoa.cpf;
          }
        }

        // Formatar data de nascimento
        let dataFormatada = '';
        if (assistido.pessoa?.dataNascimento) {
          if (typeof assistido.pessoa.dataNascimento === 'string') {
            dataFormatada = assistido.pessoa.dataNascimento;
          } else {
            dataFormatada = new Date(assistido.pessoa.dataNascimento).toISOString().split('T')[0];
          }
        }

        this.assistidoForm.patchValue({
          nome: assistido.pessoa?.nome || '',
          segundoNome: assistido.pessoa?.segundoNome || '',
          cpf: cpfFormatado,
          dataNascimento: dataFormatada,
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
      
      if (this.isEditMode) {
        // Para edição, precisamos buscar os dados atuais primeiro para preservar os IDs
        this.assistidoService.buscarPorId(this.assistidoId!).subscribe({
          next: (assistidoAtual) => {
            const assistidoData = {
              idAssistido: this.assistidoId,
              numProcesso: formValue.numProcesso,
              numAuto: formValue.numAuto,
              observacao: formValue.observacao,
              pessoa: {
                idPessoa: assistidoAtual.pessoa?.idPessoa,
                nome: formValue.nome,
                segundoNome: formValue.segundoNome,
                cpf: formValue.cpf,
                dataNascimento: formValue.dataNascimento,
                telefone: formValue.telefone,
                endereco: {
                  idEndereco: assistidoAtual.pessoa?.endereco?.idEndereco,
                  logradouro: formValue.endereco,
                  cep: assistidoAtual.pessoa?.endereco?.cep || '00000-000',
                  bairro: assistidoAtual.pessoa?.endereco?.bairro || 'A definir',
                  cidade: assistidoAtual.pessoa?.endereco?.cidade || 'A definir',
                  estado: assistidoAtual.pessoa?.endereco?.estado || 'A definir',
                  numero: assistidoAtual.pessoa?.endereco?.numero || 0
                }
              }
            };

            this.assistidoService.atualizar(this.assistidoId!, assistidoData).subscribe({
              next: (response) => {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Assistido atualizado com sucesso!',
                  text: 'Assistido foi atualizado com sucesso.',
                  timer: 2000,
                  showConfirmButton: false
                });
                this.router.navigate(['/assistidos']);
              },
              error: (error) => {
                this.loading = false;
                console.error('Erro ao atualizar assistido:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Erro ao atualizar assistido',
                  text: 'Verifique os dados e tente novamente',
                  confirmButtonText: 'OK'
                });
              }
            });
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao buscar assistido para edição:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao carregar dados',
              text: 'Não foi possível carregar os dados do assistido para edição',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        // Para criação, usar o formato original
        const assistidoData = {
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

        this.assistidoService.criar(assistidoData).subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Assistido cadastrado com sucesso!',
              text: 'Assistido foi cadastrado com sucesso.',
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate(['/assistidos']);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erro ao cadastrar assistido:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erro ao cadastrar assistido',
              text: 'Verifique os dados e tente novamente',
              confirmButtonText: 'OK'
            });
          }
        });
      }
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

  // Método para obter erros do formulário
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.assistidoForm.controls).forEach(key => {
      const control = this.assistidoForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
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