import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import axios from 'axios';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  private apiUrl = environment.apiUrl;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  states: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toast: NgToastService
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cpf: ['', Validators.required],
        rg: ['', Validators.required],
        issuing_agency: ['', Validators.required],
        postal_code: ['', Validators.required],
        street: [{ value: '', disabled: true }, Validators.required],
        house_number: [{ value: '', disabled: true }, Validators.required],
        complement: [{ value: '', disabled: true }],
        neighborhood: [{ value: '', disabled: true }, Validators.required],
        city: [{ value: '', disabled: true }, Validators.required],
        state: [{ value: '', disabled: true }, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        is_admin: [false],
        cargo: [{ value: '', disabled: true }, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.registerForm.get('postal_code')?.valueChanges.subscribe((value) => {
      const cleanedValue = value.replace(/\D/g, '');
      if (cleanedValue && cleanedValue.length === 8) {
        this.fetchAddressData(cleanedValue);
      } else {
        this.disableAddressFields();
      }
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  removeMask(fieldName: string): void {
    const value = this.registerForm.get(fieldName)?.value;
    if (value) {
      const cleanedValue = value.replace(/\D/g, '');
      this.registerForm.get(fieldName)?.setValue(cleanedValue);
    }
  }

  private fetchAddressData(postalCode: string): void {
    this.enableAddressFields();
    this.http.get(`https://opencep.com/v1/${postalCode}`).subscribe({
      next: (response: any) => {
        this.registerForm.patchValue({
          street: response.logradouro,
          neighborhood: response.bairro,
          complement: response.complemento,
          city: response.localidade,
          state: response.uf,
        });
      },
      error: (error) => {
        console.error('Erro ao buscar dados do endereço:', error);
      },
    });
  }

  private enableAddressFields(): void {
    this.registerForm.get('street')?.enable();
    this.registerForm.get('house_number')?.enable();
    this.registerForm.get('complement')?.enable();
    this.registerForm.get('neighborhood')?.enable();
    this.registerForm.get('city')?.enable();
    this.registerForm.get('state')?.enable();
  }

  private disableAddressFields(): void {
    this.registerForm.get('street')?.disable();
    this.registerForm.get('house_number')?.disable();
    this.registerForm.get('complement')?.disable();
    this.registerForm.get('neighborhood')?.disable();
    this.registerForm.get('city')?.disable();
    this.registerForm.get('state')?.disable();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = this.registerForm.hasError('passwordMismatch')
        ? 'Senhas não conferem.'
        : 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.removeMask('cpf');
    this.removeMask('rg');
    this.removeMask('postal_code');

    const formData = this.registerForm.value;
    if (this.registerForm.valid) {
      try {
        await axios.post(`${this.apiUrl}/users`, formData);
        // Limpar o formulário e redefinir o estado inicial
        this.registerForm.reset(); // Reseta os valores do formulário
        Object.keys(this.registerForm.controls).forEach((controlName) => {
          this.registerForm.get(controlName)?.setErrors(null); // Remove os erros de validação
        });
        this.toast.success('Usuário cadastrado com sucesso!', 'Fechar', 4000);
        this.router.navigate(['/requests/user-registration']);
      } catch (error) {
        this.errorMessage = 'Erro ao criar conta. Tente novamente.';
        console.error('Erro ao criar usuário:', error);
      }
    }
  }

  onAdminChange(event: any): void {
    const isAdmin = event.value; // Valor selecionado
    this.registerForm.get('is_admin')?.setValue(isAdmin);

    if (isAdmin) {
      this.registerForm.get('cargo')?.enable();
    } else {
      this.registerForm.get('cargo')?.disable();
      this.registerForm.get('cargo')?.reset();
    }
  }
}
