import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeclarationsService } from '../../../../shared/services/api/declarations.service';
import { Declaration } from '../../../../shared/domain/declaration.type';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface VariableNode {
  name: string;
  children?: VariableNode[];
}


@Component({
  selector: 'app-declaration-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    MatTreeModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './declaration-edit.component.html',
  styleUrl: './declaration-edit.component.css'
})
export class DeclarationEditComponent {
  public declaration: Declaration = {
    id: '',
    content: '',
    type: '',
    title: '',
    footer: '',
    signatureType: 'director',
  };
  public declarationForm: FormGroup;
  public guideText: string = `
    Campos dinâmicos permitem personalizar seus documentos com informações variáveis.
    Utilize a sintaxe básica colocando as palavras ou variáveis entre as chaves duplas <b>{{</b> e <b>}}</b>.
    Por exemplo: <b>{{</b>nome<b>}}</b> para inserir o nome do solicitante ou <b>{{</b>data_atual<b>}}</b> para a data atual.
  `;
  public dataSource: VariableNode[] = [
    {
      name: 'Geral',
      children: [{
        name: '{{data_atual}}: Data atual'
      }]
    },
    {
      name: 'Solicitante',
      children: [
        { name: '{{nome}}: Nome' },
        { name: '{{rua}}: Rua' },
        { name: '{{numero_casa}}: Número da casa' },
        { name: '{{complemento}}: Complemento da residência' },
        { name: '{{bairro}}: Bairro' },
        { name: '{{cidade}}: Cidade' },
        { name: '{{estado}}: Estado' },
        { name: '{{cep}}: CEP' },
        { name: '{{data_atual}}: Data atual' },
        { name: '{{rg}}: RG' },
        { name: '{{cpf}}: CPF' },
        { name: '{{orgao_emissor}}: Órgão emissor do RG' }
      ]
    },
    {
      name: 'Diretor',
      children: [
        { name: '{{diretor_nome}}: Nome' },
        { name: '{{diretor_cpf}}: CPF' },
        { name: '{{diretor_cargo}}: Cargo' }
      ]
    }
  ];
  public childrenAccessor = (node: VariableNode) => node.children ?? [];
  public hasChild = (_: number, node: VariableNode) => !!node.children && node.children.length > 0;
  public isSubmitting: boolean = false;
  public preview: boolean = false;
  public contentLines: string[] = [];
  public footerLines: string[] = [];
  public signatureLines: string[] = [];


  private declarationId: string = '';

  toast = inject(NgToastService);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private declarationsService: DeclarationsService,
    private router: Router,
  ) {
    this.declarationForm = this.fb.group({
      type: ['', [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      signatureType: ['', [Validators.required, this.signatureTypeValidator]],
    });
  }

  signatureTypeValidator(control: FormControl) {
    const allowedValues = ['director', 'requester'];
    if (!allowedValues.includes(control.value)) {
      return { signatureTypeInvalid: { message: 'Valor inválido. Use "director" ou "requester".' } };
    }
    return null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.declarationId = params['id'];
      this.getDeclaration(this.declarationId);
    });
  }

  getDeclaration(id: string) {
    this.declarationsService.getDeclaration(id).subscribe({
      next: (data) => {
        this.declaration = data;
        const { createdAt, updatedAt, ...update } = data;
        this.declarationForm.patchValue(update);
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar a declaração',
          5000
        );
      },
    });
  }

  generatePreview() {
    this.preview = !this.preview;

    const formValues = this.declarationForm.value;

    const fakeValues = {
      nome: 'João da Silva',
      rua: 'Rua Exemplo',
      numero_casa: '123',
      complemento: 'Apto 101',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000',
      data_atual: '11 de Janeiro de 2025',
      rg: '12.345.678-9',
      cpf: '123.456.789-01',
      orgao_emissor: 'SSP-SP',
      diretor_nome: 'Carlos Pereira',
      diretor_cpf: '987.654.321-00',
      diretor_cargo: 'Diretor Geral',
    };


    let signature = '';

    switch (formValues.signatureType) {
      case 'requester':
        signature = `\n\n${fakeValues.nome}\nRG nº ${fakeValues.rg}/${fakeValues.orgao_emissor}\nCPF/MF nº ${fakeValues.cpf}`;
        break;
      case 'director':
        signature = `\n\n${fakeValues.diretor_nome}\nCPF: ${fakeValues.diretor_cpf}\n${fakeValues.diretor_cargo}`;
        break;
      default:
        break;
    }

    let contentWithValues = this.replaceDynamicValues(formValues.content, fakeValues);
    let footerWithValues = this.replaceDynamicValues(formValues.footer, fakeValues);
    let signatureWithValues = this.replaceDynamicValues(signature, fakeValues);

    this.contentLines = contentWithValues.split('\n');
    this.footerLines = footerWithValues.split('\n');
    this.signatureLines = signatureWithValues.split('\n');
  }

  replaceDynamicValues(text: string, values: { [key: string]: string; }): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || `{{${key}}}`);
  }

  onSubmit() {
    if (this.declarationForm.invalid || this.isSubmitting) {
      this.toast.danger(
        'Tente novamente',
        'Os dados do formulário estão inválidos',
        5000
      );
      return;
    }

    this.isSubmitting = true;

    this.declarationsService.updateDeclaration(this.declarationId, this.declarationForm.value).subscribe({
      next: () => {
        this.toast.success('Dados atualizados com sucesso!', 'Fechar', 5000);
        this.router.navigate(['/declarations']);
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Erro ao atualizar os dados.',
          5000
        );
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
