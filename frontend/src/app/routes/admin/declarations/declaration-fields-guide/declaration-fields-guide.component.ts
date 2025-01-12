import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

interface VariableNode {
  name: string;
  children?: VariableNode[];
}

@Component({
  selector: 'app-declaration-fields-guide',
  standalone: true,
  imports: [
    MatTreeModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './declaration-fields-guide.component.html',
  styleUrl: './declaration-fields-guide.component.css'
})
export class DeclarationFieldsGuideComponent {
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
}
