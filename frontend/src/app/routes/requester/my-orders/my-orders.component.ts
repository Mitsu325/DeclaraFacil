import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsService } from '../../../shared/services/api/requests.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserRequest } from '../../../shared/domain/requests.type';
import { NgToastService } from 'ng-angular-popup';
import { StatusPipe } from '../../../core/pipes/status.pipe';
import { RequestConfirmComponent } from './dialog/request-confirm/request-confirm.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    DatePipe,
    StatusPipe,
  ],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  requests: UserRequest[] = [];
  displayedColumns: string[] = [
    'declaration',
    'attendantName',
    'requestDate',
    'generationDate',
    'status',
  ];

  toast = inject(NgToastService);

  constructor(
    private requestsService: RequestsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestsService.getUserRequests().subscribe({
      next: (data) => {
        this.requests = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar as solicitações',
          5000
        );
      },
    });
  }

  openRequestDialog(): void {
    const dialogRef = this.dialog.open(RequestConfirmComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submitRequest(result);
      }
    });
  }

  submitRequest(declarationId: string): void {
    this.requestsService.createRequest(declarationId).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (error) => {
        if (error.status === 409) {
          this.toast.danger(
            'Você já possui uma solicitação pendente desta declaração.',
            'Não é possível solicitar a declaração',
            5000
          );
        } else {
          this.toast.danger(
            'Tente novamente',
            'Falha ao solicitar declaração',
            5000
          );
        }
      },
    });
  }
}
