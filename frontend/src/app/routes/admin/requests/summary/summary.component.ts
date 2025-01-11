import { Component, inject } from '@angular/core';
import { DeclarationRequestType } from '../../../../shared/domain/requests.type';
import { StatusPipe } from '../../../../core/pipes/status.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { RequestsService } from '../../../../shared/services/api/requests.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [StatusPipe, MatTableModule, MatButtonModule, DatePipe],
  templateUrl: './summary.component.html',
  styleUrl: '../requests.component.css',
})
export class SummaryComponent {
  dataSource: DeclarationRequestType[] = [];
  displayedColumns: string[] = ['declaration', 'name', 'generationDate', 'status', 'url'];

  toast = inject(NgToastService);

  constructor(private requestsService: RequestsService) { }

  ngOnInit() {
    this.getRequestsWithDeclarations();
  }

  getRequestsWithDeclarations(): void {
    this.requestsService.getRequestsWithDeclarations().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar as declarações geradas',
          5000
        );
      },
    });
  }
}
