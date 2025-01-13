import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../../../shared/services/api/auth.service';

@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  public resetPasswordForm: FormGroup;
  public isSubmitting: boolean = false;
  public token: string = '';
  public showPassword: boolean = false;

  toast = inject(NgToastService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  get passwordMatch() {
    return this.resetPasswordForm.get('newPassword')?.value === this.resetPasswordForm.get('confirmPassword')?.value;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (!this.passwordMatch) {
      this.toast.danger(
        'Tente novamente',
        'As senhas precisam ser iguais',
        5000
      );

      return;
    }

    if (this.resetPasswordForm.invalid || this.isSubmitting) {
      this.toast.danger(
        'Tente novamente',
        'Os dados do formulário estão inválidos',
        5000
      );

      return;
    }

    this.isSubmitting = true;
    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword({ token: this.token, newPassword }).subscribe({
      next: () => {
        this.toast.success('Sua senha foi redefinida com sucesso.', 'Senha alterada!', 5000);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toast.danger('Erro ao redefinir a senha. Tente novamente.', 'Falha na redefinição', 5000);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
