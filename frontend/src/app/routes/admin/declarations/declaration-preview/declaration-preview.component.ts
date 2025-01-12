import { Component, Input } from '@angular/core';
import { SignatureType } from '../../../../shared/domain/declaration.type';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-declaration-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './declaration-preview.component.html',
  styleUrl: './declaration-preview.component.css'
})
export class DeclarationPreviewComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() footer: string = '';
  @Input() signatureType: SignatureType = 'director';

  public contentLines: string = '';
  public footerLines: string = '';
  public signatureLines: string = '';

  constructor() { }

  ngOnInit() {
    let signature = '';

    switch (this.signatureType) {
      case 'requester':
        signature = `\n\n${fakeValues.nome}\nRG nº ${fakeValues.rg}/${fakeValues.orgao_emissor}\nCPF/MF nº ${fakeValues.cpf}`;
        break;
      case 'director':
        signature = `\n\n${fakeValues.diretor_nome}\nCPF: ${fakeValues.diretor_cpf}\n${fakeValues.diretor_cargo}`;
        break;
      default:
        break;
    }

    let contentWithValues = this.replaceDynamicValues(this.content, fakeValues);
    let footerWithValues = this.replaceDynamicValues(this.footer, fakeValues);
    let signatureWithValues = this.replaceDynamicValues(signature, fakeValues);

    this.contentLines = contentWithValues;
    this.footerLines = footerWithValues;
    this.signatureLines = signatureWithValues;
  }

  replaceDynamicValues(text: string, values: { [key: string]: string; }): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || `{{${key}}}`);
  }
}
