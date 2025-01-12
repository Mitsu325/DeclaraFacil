import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../shared/domain/users.type';
import { NgToastService } from 'ng-angular-popup';
import { UsersService } from '../../../shared/services/api/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, DatePipe,],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  dataSource: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'cpf', 'createdAt'];

  toast = inject(NgToastService);

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os usuários cadastrados',
          5000
        );
      },
    });
  }
}
