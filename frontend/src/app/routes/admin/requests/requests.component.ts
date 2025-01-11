import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { DeclarationRequestType } from '../../../shared/domain/requests.type';
import { StatusPipe } from '../../../core/pipes/status.pipe';
import { MatDialog } from '@angular/material/dialog';
import { GenerateDeclarationConfirmComponent } from './dialog/generate-declaration-confirm/generate-declaration-confirm.component';
import { FinalizeDeclarationConfirmComponent } from './dialog/finalize-declaration-confirm/finalize-declaration-confirm.component';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DeclarationRequestService } from '../../../shared/services/declaration-request.service';
import { RequestsService } from '../../../shared/services/api/requests.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    StatusPipe,
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent {
  displayedColumns: string[] = ['declaration', 'name', 'requestDate', 'status', 'select'];
  dataSource: DeclarationRequestType[] = [];
  selection = new SelectionModel<DeclarationRequestType>(true, []);
  dialog = inject(MatDialog);
  toast = inject(NgToastService);

  constructor(
    private router: Router,
    private declarationRequestService: DeclarationRequestService,
    private requestsService: RequestsService
  ) { }

  ngOnInit() {
    this.getRequests();
  }

  getRequests(): void {
    this.requestsService.getRequests().subscribe({
      next: (data) => {
        this.dataSource = data;
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

  checkboxLabel(row: DeclarationRequestType): string {
    return `${this.selection.isSelected(row) ? 'deselecionar' : 'selecionar'
      } a pessoa ${row.name}`;
  }

  openGenerateDeclarationConfirmDialog() {
    const pendingRequests: DeclarationRequestType[] =
      this.selection.selected.filter(
        (request: DeclarationRequestType) => request.status === 'pending'
      );

    let dialogRef = this.dialog.open(GenerateDeclarationConfirmComponent, {
      data: {
        requests: pendingRequests,
      },
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.director) {
        this.generateDeclarations(pendingRequests, result.director);
      }
    });
  }

  generateDeclarations(pendingRequests: DeclarationRequestType[], directorId: string) {
    if (pendingRequests.length === 0) {
      this.toast.info('Nenhuma declaração pendente para gerar.', 'Atenção');
      return;
    }

    this.declarationRequestService.clean();

    this.router.navigate(['/completed-declarations']);

    this.declarationRequestService.setTotalRequest(pendingRequests.length);

    pendingRequests.forEach((request, index) => {
      this.requestsService.generatePDF([request.id], directorId).subscribe({
        next: (response) => {
          this.declarationRequestService.setGeneratedDeclarations(response);

          this.declarationRequestService.setCurrentRequest(index + 1);

          this.declarationRequestService.incrementSuccessCount();
        },
        error: () => {
          this.declarationRequestService.incrementErrorCount();

          this.declarationRequestService.setCurrentRequest(index + 1);
        },
        complete: () => {
          this.declarationRequestService.setCurrentRequest(index + 1);
        },
      });
    });
  }

  openFinalizeDeclarationConfirmDialog(type: 'rejected' | 'completed') {
    const processingRequests: DeclarationRequestType[] =
      this.selection.selected.filter(
        (request: DeclarationRequestType) => request.status === 'processing'
      );

    let dialogRef = this.dialog.open(FinalizeDeclarationConfirmComponent, {
      data: {
        requests: processingRequests,
        type,
      },
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.finalizeDeclarations(processingRequests, type);
      }
    });
  }

  finalizeDeclarations(
    processingRequests: DeclarationRequestType[],
    status: 'rejected' | 'completed'
  ) {
    const requestIds = processingRequests
      .filter((request) => request.status === 'processing')
      .map((request) => request.id);

    if (requestIds.length === 0) {
      this.toast.info('Nenhuma declaração para ser finalizada.', 'Atenção');
      return;
    }

    this.requestsService.updateStatus(requestIds, status).subscribe({
      next: (response) => {
        response.forEach((updatedRequest: DeclarationRequestType) => {
          const index = this.dataSource.findIndex(
            (request) => request.id === updatedRequest.id
          );

          if (index !== -1) {
            this.dataSource[index].status = updatedRequest.status;
          }
        });
        this.toast.success(
          `Sua declaração foi ${status === 'completed' ? 'finalizada' : 'rejeitada'
          } com sucesso!`,
          `Declaração ${status === 'completed' ? 'Finalizada' : 'Rejeitada'}`,
          5000
        );
      },
      error: () => {
        this.toast.warning(
          `Houve um erro ao ${status === 'completed' ? 'finalizada' : 'rejeitada'
          } a declaração.`,
          'Erro',
          5000
        );
      },
    });
  }
}
