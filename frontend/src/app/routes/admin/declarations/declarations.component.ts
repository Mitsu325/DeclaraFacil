import { Component, inject } from '@angular/core';
import { Declaration } from '../../../shared/domain/declaration.type';
import { NgToastService } from 'ng-angular-popup';
import { DeclarationsService } from '../../../shared/services/api/declarations.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { DeleteDeclarationConfirmComponent } from './dialog/delete-declaration-confirm/delete-declaration-confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-declarations',
  standalone: true,
  imports: [MatTableModule, DatePipe, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './declarations.component.html',
  styleUrl: './declarations.component.css',
})
export class DeclarationsComponent {
  dataSource: Declaration[] = [];
  displayedColumns: string[] = ['declaration', 'createdBy', 'updatedAt', 'edit'];

  toast = inject(NgToastService);
  dialog = inject(MatDialog);

  constructor(private declarationsService: DeclarationsService, private router: Router) { }

  ngOnInit() {
    this.getDeclarations();
  }

  getDeclarations(): void {
    this.declarationsService.getDeclarations().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar as declarações cadastradas',
          5000
        );
      },
    });
  }

  declarationCreate() {
    this.router.navigate([`/declarations/create`]);
  }

  declarationEdit(id: string) {
    this.router.navigate([`/declarations/${id}/edit`]);
  }

  declarationDeleteConfirmDialog(declaration: Declaration) {
    let dialogRef = this.dialog.open(DeleteDeclarationConfirmComponent, {
      data: {
        declarationName: declaration.type,
      },
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.declarationDelete(declaration.id);
      }
    });
  }

  declarationDelete(id: string) {
    this.declarationsService.deleteDeclaration(id).subscribe({
      next: () => {
        this.getDeclarations();

        this.toast.success(
          `A declaração foi desativada e não poderá mais ser gerada.`,
          `Declaração desativada`,
          5000
        );
      },
      error: () => {
        this.toast.warning(
          `Houve um erro ao desativar a declaração.`,
          'Erro',
          5000
        );
      },
    });
  }
}
