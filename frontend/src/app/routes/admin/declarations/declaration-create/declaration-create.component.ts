import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DeclarationsService } from '../../../../shared/services/api/declarations.service';
import { DeclarationFieldsGuideComponent } from '../declaration-fields-guide/declaration-fields-guide.component';
import { DeclarationPreviewComponent } from '../declaration-preview/declaration-preview.component';

@Component({
  selector: 'app-declaration-create',
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
  ],
  templateUrl: './declaration-create.component.html',
  styleUrl: './declaration-create.component.css'
})
export class DeclarationCreateComponent {
  public declarationForm: FormGroup;

  public isSubmitting: boolean = false;
  public preview: boolean = false;

  toast = inject(NgToastService);

  constructor(
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

    this.declarationsService.createDeclaration(this.declarationForm.value).subscribe({
      next: () => {
        this.toast.success('A declaração foi criada com sucesso e está pronta para ser visualizada ou editada.', 'Declaração Criada!', 5000);
        this.router.navigate(['/declarations']);
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Erro ao criar declaração.',
          5000
        );
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
