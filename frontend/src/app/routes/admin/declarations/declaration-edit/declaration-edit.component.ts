import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeclarationsService } from '../../../../shared/services/api/declarations.service';
import { Declaration } from '../../../../shared/domain/declaration.type';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DeclarationFieldsGuideComponent } from '../declaration-fields-guide/declaration-fields-guide.component';
import { DeclarationPreviewComponent } from '../declaration-preview/declaration-preview.component';

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
    MatIconModule,
    MatDividerModule,
    DeclarationFieldsGuideComponent,
    DeclarationPreviewComponent,
    RouterLink,
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
    active: true,
  };
  public declarationForm: FormGroup;
  public isSubmitting: boolean = false;
  public preview: boolean = false;

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
        this.toast.success('As modificações na declaração foram salvas com sucesso. Tudo pronto para seguir.', 'Alterações Salvas!', 5000);
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
