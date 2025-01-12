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

  constructor(private declarationsService: DeclarationsService, private router: Router) { }

  ngOnInit() {
    this.getRequestsWithDeclarations();
  }

  getRequestsWithDeclarations(): void {
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
}
