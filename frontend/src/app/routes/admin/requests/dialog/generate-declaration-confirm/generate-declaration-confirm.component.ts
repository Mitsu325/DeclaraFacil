import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { DeclarationRequestType } from '../../../../../shared/domain/requests.type';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../../../../../shared/services/api/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Director {
  id: string;
  name: string;
}

@Component({
  selector: 'app-generate-declaration-confirm',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './generate-declaration-confirm.component.html',
  styleUrl: './generate-declaration-confirm.component.css',
})
export class GenerateDeclarationConfirmComponent {
  data = inject(MAT_DIALOG_DATA);
  pendingRequests: DeclarationRequestType[] = [];
  directors: Director[] = [];
  requiresDirectorSignature: boolean = false;
  selectedDirector = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<GenerateDeclarationConfirmComponent>,
    public usersService: UsersService,
  ) { }

  ngOnInit() {
    this.pendingRequests = this.data.requests;

    this.requiresDirectorSignature = this.pendingRequests.some(request => request.declarationSignature === 'director');

    this.getAdmin();
  }

  getAdmin() {
    this.usersService.getAdmin().subscribe((admin) => {
      this.directors = admin;
    });
  }

  onConfirm(): void {
    this.dialogRef.close({ director: this.selectedDirector.value || '' });
  }
}
