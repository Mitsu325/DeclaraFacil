import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../../../shared/services/api/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  public forgotPasswordForm: FormGroup;
  public isSubmitting: boolean = false;

  toast = inject(NgToastService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.invalid || this.isSubmitting) {
      this.toast.danger(
        'Tente novamente',
        'Os dados do formulário estão inválidos',
        5000
      );

      return;
    }

    this.isSubmitting = true;

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: () => {
        this.toast.success('Link de recuperação de senha enviado com sucesso.', 'E-mail enviado!', 5000);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toast.danger(
          'Houve um problema ao enviar o link de recuperação. Tente novamente.',
          'Erro ao enviar o e-mail!',
          5000
        );
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
