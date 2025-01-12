import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-declaration-confirm',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './delete-declaration-confirm.component.html',
  styleUrl: './delete-declaration-confirm.component.css'
})
export class DeleteDeclarationConfirmComponent {
  data = inject(MAT_DIALOG_DATA);
  declarationName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteDeclarationConfirmComponent>
  ) { }

  ngOnInit() {
    this.declarationName = this.data.declarationName;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
